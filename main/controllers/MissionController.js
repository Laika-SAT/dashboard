import db from '../db';

export default class MissionController {

    /**
     *
     * @param {String} name
     * @param {("inactive"|"active"|"failed")} [status="inactive"]
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {("simulation"|"live")} [mode="simulation"]
     * @returns {Promise<Boolean>}
     */
    static async create({
        name,
        status = 'inactive',
        startDate,
        endDate,
        mode = 'simulation'
    }) {
        try {
            if (!name) throw new Error('Name is not specified');
            if (typeof name !== 'string') throw new Error('Name should be a string');
            if (name.length > 255) throw new Error('Name length limit exceeded');
            if (!startDate) startDate = new Date();

            return new Promise((resolve, reject) => {
                db.run(`INSERT INTO missions(name, status, startDate, endDate, mode) VALUES(?, ?, ?, ?, ?)`, [
                    name, status, startDate.toString(), endDate ? endDate.toString() : null, mode
                ], function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    MissionController.get(this.lastID)
                        .then((record) => resolve(record))
                        .catch((getError) => reject(getError));
                });
            });
        } catch (error) {
            //TODO: Do something with errors
            console.error('SNDSJBNF', error);
        }
    }

    /**
     *
     * @param {Number} id
     * @returns {Promise<unknown>}
     */
    static async get(id) {
        try {
            if (!id) throw new Error('No id provided');
            return new Promise((resolve, reject) => {
                db.all('SELECT * FROM missions WHERE id = ?', [id], function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    resolve(data[0]);
                });
            });
        } catch (error) {
            console.error('DF0GHHS0', error);
        }
    }

    static async update(id, updateInput) {
        try {
            if (!id) throw new Error("No id provided");
            const prev = await this.get(id);
            if (!prev) throw new Error(`There are no mission with id ${id}`);
            return new Promise((resolve, reject) => {
                const vars = Object.keys(updateInput)
                    .reduce((acc, current, index) => {
                        return acc + (updateInput[current] && `${current} = ?${index < updateInput.length-1 ? ',' : ''}`)
                    }, '');
                db.run(`UPDATE missions SET ${vars} WHERE id=?`, [...(Object.keys(updateInput).map(k => updateInput[k])), id], function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    MissionController.get(this.lastID)
                        .then((record) => resolve(record))
                        .catch((getError) => reject(getError));
                });
            });
        } catch (error) {
            console.error("ISHDFOUS", error);
        }
    }

    /**
     *
     * @param {Number} id
     * @returns {Promise<unknown>}
     */
    static async remove (id) {
        try {
            if (!id) throw new Error('No id provided');
            const prev = await this.get(id);
            if (!prev) throw new Error(`There are no mission with id ${id}`);
            return new Promise((resolve, reject) => {
                db.run('DELETE FROM missions WHERE id=?', [id], function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                });
            });
        } catch (error) {
            console.error("SAPIDJDF", error);
        }
    }

    /**
     * @param {Object} filter
     * @param {String} filter.query
     * @param {("inactive"|"active"|"failed")} filter.status
     * @param {("simulation"|"live")} filter.mode
     * @param {[Date]} filter.startDate - array of dates
     * */
    static processFilter (filter) {
        if (Object.keys(filter).length === 0) return ['', []];

        let conditions = [], vars = [];
        if (filter.query) {
            conditions.push(`name LIKE ?`);
            vars.push(`%${filter.query}%`);
        }
        if (filter.status) {
            conditions.push(`status = ?`);
            vars.push(filter.status);
        }
        if (filter.mode) {
            conditions.push(`mode = ?`);
            vars.push(filter.mode);
        }
        if (filter.startDate) {
            conditions.push(`startDate BETWEEN datetime(?) AND datetime(?)`);
            const from = filter.startDate[0];
            const to = filter.startDate.length === 1 ? filter.startDate[1] : new Date();
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
            db.all(`SELECT COUNT(*) FROM missions ${conditions}`, vars, function (err, data) {
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
            order = `ORDER BY ${options.ord ? options.ord : 'startDate'} ${options.asc ? 'ASC' : 'DESC'}`;
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM missions ${conditions} ${order} ${limit} ${skip}`, vars, function (err, data) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
}
