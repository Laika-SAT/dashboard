import MissionController from "./controllers/MissionController";
import { ipcMain } from 'electron';
import { apiMethod } from './helpers/util';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

ipcMain.handle('missions:get', apiMethod((event, id) => MissionController.get(id)));

ipcMain.handle(
    'missions:create',
    apiMethod((event, createInput) => MissionController.create(JSON.parse(createInput)))
);

ipcMain.handle('missions:update', apiMethod((event, updateInput) => MissionController.update(updateInput)));

ipcMain.handle('missions:delete', apiMethod((event, id) => MissionController.remove(id)));

ipcMain.handle('missions:list', apiMethod(async (event, data) => {
    const { filter, options: { num, pag, ord, asc } } = JSON.parse(data);
    const rows = await MissionController.list(filter, { num, pag, ord, asc }),
        totalCount = await MissionController.count(filter);
    return {
        totalCount,
        totalEdges: rows.length,
        pag, hasMore: ((pag + 1) * num < totalCount),
        data: rows
    };
}));

const headers = ["team", "presion", "temperatura", "orx", "ory", "orz", "acx", "acy", "acz", "vx", "vy", "vz", "voltaje", "gps_p_lat", "gps_p_long", "gps_p_alt", "gps_s_lat", "gps_s_long", "gps_s_alt", "elevacion", "azimuth", "distancia"];

ipcMain.handle('missions:metrics', apiMethod(async (event, id) => {
    const fileName = path.resolve(__dirname, '../data/', `mission-${id}.csv`);
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const records = String(data).split('\n').map(r => {
                    return r.split(',');
                });
                resolve([headers, ...records]);
            }
        });
    });
}));