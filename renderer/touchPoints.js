import electron from 'electron';

export class MissionTouchPoint {
    static async get (id) {
        if (electron.ipcRender) {
            return await ipcRender.invoke('missions:get', id);
        }
    }

    static async create (createInput) {
        if (electron.ipcRender) {
            return await ipcRender.invoke('missions:create', createInput);
        }
    }

    static async update (updateInput) {
        if (electron.ipcRender) {
            return await ipcRender.invoke('missions:update', updateInput);
        }
    }

    static async remove (id) {
        if (electron.ipcRender) {
            return await ipcRender.invoke('missions:delete', id);
        }
    }

    static async list (filter, options) {
        if (electron.ipcRender) {
            return await ipcRender.invoke('missions:list', { filter, options });
        }
    }
}

export default {
    MissionTouchPoint
}