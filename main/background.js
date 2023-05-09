import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
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
    "path": "/dev/cu.usbserial-0001",
    "baudRate": 9600
}, function (err) {
  if (err) {
    return console.log('SERIAL PORT ERROR: ', err);
  }
});
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

let packets = 0;
const keys = ["team", "presion", "temperatura", "orx", "ory", "orz", "acx", "acy", "acz", "vx", "vy", "vz", "voltaje", "gps_p_lat", "gps_p_long", "gps_p_alt", "gps_s_lat", "gps_s_long", "gps_s_alt", "elevacion", "azimuth", "distancia"];

function parsePacket (packet) {
  const sp = String(packet).split(',');
  return sp.reduce((ac, current, index) => Object.assign(ac, { [keys[index]]: parseFloat(current) }), { timestamp: packets });
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', CONFIG.WINDOW);

  wss.on('connection', function(w) {
     parser.on('data', (data) => {
        packets++;
        w.send(JSON.stringify(parsePacket(data)));
     });
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
