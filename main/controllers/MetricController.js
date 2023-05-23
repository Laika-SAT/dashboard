import db from '../db';
import MissionController from './MissionController';

export default class MetricController {

    static packetKeys = [
        // LAIKA 1
        "packet_1", 
        "vx_1", 
        "vy_1", 
        "vz_1",
        "orx_1", 
        "ory_1",
        "orz_1",
        "acx_1",
        "acy_1",
        "acz_1",
        "gps_p_lat", 
        "gps_p_long", 
        "gps_p_alt",
        "voltaje_1",
        // LAIKA 2
        "packet_2",
        "pressure",
        "temperature",
        "high",
        "vx_2", 
        "vy_2", 
        "vz_2",
        "orx_2", 
        "ory_2", 
        "orz_2",
        "acx_2", 
        "acy_2", 
        "acz_2",
        "gps_s_lat",
        "gps_s_long",
        "gps_s_alt",
        "voltaje_2",
        "ascent",
        "maxHighReached",
        "autogiro",
        "payloadRelease",
        "valid",
    ];
    static packetValidator = new RegExp(/^LAIKA1,[0-9.-]+,([0-9.-]+,)*[0-9.-]+,$/);

    static async create({
        timestamp,
        valid,
        packet,
        mission,
    }) {
        try {
            if (!packet) throw new Error('No packet specified');
            if (!mission) throw new Error('Mission should be declared');
            if (!timestamp) timestamp = Math.floor(new Date().getTime() / 1000);

            return new Promise((resolve, reject) => {
                db.run(`INSERT INTO metrics(timestamp, valid, packet, mission) VALUES(?, ?, ?, ?)`, [
                    timestamp, valid, packet, mission,
                ], function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const id = this.lastID;
                    resolve({ id, timestamp, valid, mission, packet });
                });
            });
        } catch (error) {
            console.error('ASIDFHOFGG', error);
        }
    }

    static async get(id) {
        try {
            if (!id) throw new Error('No id provided');
            return new Promise((resolve, reject) => {
                db.all('SELECT * FROM metrics WHERE id = ?', [id], function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    resolve(data[0]);
                });
            });
        } catch (error) {
            console.error('SDFINPSSD', error);
        }
    }

    static async getByMissionId(id) {
        try {
            const rows = await new Promise((resolve, reject) => {
                db.all(`SELECT * FROM metrics WHERE mission = ? ORDER BY timestamp DESC`, [id], function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });
            let unpackedRows = rows.map(r => r?.packet?.split(','));
            return [MetricController.packetKeys, ...unpackedRows];
        } catch (error) {
            console.error('ASDONODFS', error);
        }
    }

    static async remove (id) {
        try {
            if (!id) throw new Error('No id provided');
            const prev = await this.get(id);
            if (!prev) throw new Error(`There are no metric with id ${id}`);
            return new Promise((resolve, reject) => {
                db.run('DELETE FROM metrics WHERE id=?', [id], function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                });
            });
        } catch (error) {
            console.error("SIOHFOSDFS", error);
        }
    }

    static async removeByMissionId (id) {
        try {
            if (!id) throw new Error('No id provided');
            const mission = await MissionController.get(id);
            if (!mission) throw new Error('the provided id does not belong from any stored mission');
            return new Promise((resolve, reject) => {
                db.run('DELETE FROM metrics WHERE mission=?', [id], function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                });
            });
        } catch (error ){
            console.error('ODBNOSDFSA', error);
        }
    }

    static processFilter (filter) {
        if (Object.keys(filter).length === 0) return ['', []];

        let conditions = [], vars = [];
        if (filter.mission) {
            conditions.push(`mission = ?`);
            vars.push(filter.mission);
        }
        if (typeof filter.valid !== 'undefined') {
            if (typeof filter.valid === 'boolean') filter.valid = +filter.valid;
            conditions.push(`valid = ?`);
            vars.push(filter.valid);
        }
        if (filter.timestamp) {
            conditions.push(`timestamp BETWEEN datetime(?) AND datetime(?)`);
            const from = filter.timestamp[0];
            const to = filter.timestamp.length === 1 ? filter.timestamp[1] : new Date();
            vars.push(...[from, to]);
        }

        conditions = conditions.reduce((acc, current, index) => {
            return acc + current + (index < conditions.length-1 ? ' AND ' : '')
        }, 'WHERE ');
        return [conditions, vars];
    }

    static async count (filter) {
        const [conditions, vars] = this.processFilter(filter);
        return new Promise((resolve, reject) => {
            db.all(`SELECT COUNT(*) FROM metrics ${conditions}`, vars, function (err, data) {
                if (err) {
                    reject(err);
                }
                resolve(data[0]['COUNT(*)']);
            });
        });
    }

    static async list (filter, options) {
        const [conditions, vars] = this.processFilter(filter),
            limit = `LIMIT ${options.num || 10}`,
            skip = `OFFSET ${(options.pag || 0) * (options.num || 1)}`,
            order = `ORDER BY ${options.ord ? options.ord : 'timestamp'} ${options.asc ? 'ASC' : 'DESC'}`;
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM metrics ${conditions} ${order} ${limit} ${skip}`, vars, function (err, data) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    static parseValue (value) {
        if (isNaN(value)) return value.toString();
        return parseFloat(value);
    }

    static unpack (packet) {
        const sp = String(packet).split(',');
        return sp.reduce((ac, current, index) =>
            Object.assign(ac, { [this.packetKeys[index]]: this.parseValue(current) }), 
        {});
    }

    static getUnpackedMetric (metric) {
        //if (!this.isValidPacket(metric.packet)) throw new Error('Metric with wrong format');
        const parsedPacket = this.unpack(metric.packet);
        delete metric.packet;
        return Object.assign(metric, parsedPacket);
    }

    static isValidPacket (packet) {
        return this.packetValidator.test(packet);
    }
}