import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import MetricController from './controllers/MetricController';
import { SerialPort, ReadlineParser } from 'serialport';
import WebSocket from 'ws';
import CONFIG from './config.json';
import './api';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}


const wss = new WebSocket.Server(CONFIG.WSS);
wss.on('error', (error) => {
  if (error) {
    return console.log('WSS ERROR: ', error);
  }
});
const serialPort = new SerialPort({
    //"path": "/dev/cu.usbserial-A50285BI",
    "path": "/dev/cu.usbserial-00000000",
    "baudRate": 9600
}, function (err) {
  if (err) {
    return console.log('SERIAL PORT ERROR: ', err);
  }
});
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

let mission = null;
let recording = false;

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', CONFIG.WINDOW);

  wss.on('connection', function(w) {
    w.on('message', function (data) {
      const parsed = JSON.parse(data);

      switch (parsed.action) {
        case 'SET_MISSION':
          mission = parsed.payload;
          console.log('MISSION CONFIGURED TO', mission);
          break;
        case 'SET_RECORDING':
          recording = parsed.payload;
          console.log('RECORDING: ', recording);
          break;
      }
    });

    parser.on('data', async (data) => {
      let packet = String(data);
      console.log(packet);
      const parsedPacket = {
        id: 0,
        timestamp: Math.floor(new Date().getTime() / 1000), 
        valid: MetricController.isValidPacket(packet), 
        mission: mission?.id, 
        packet,
      };
      if (recording) {
        try {
          await MetricController.create(parsedPacket)
        } catch (error) {
          console.error('-- METRIC ERROR --', error);
        }
      }
      const unpacketMetric = MetricController.getUnpackedMetric(parsedPacket);
      w.send(JSON.stringify(unpacketMetric));
    });
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
