import MissionController from "./controllers/MissionController";
import { ipcMain } from 'electron';
import { apiMethod } from './helpers/util';

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