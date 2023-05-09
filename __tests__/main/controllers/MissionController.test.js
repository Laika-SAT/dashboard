import MissionController from "../../../main/controllers/MissionController";
import mock from '../../../mocks/missions';

describe('Mission controller tests', () => {

    describe('CRUD works', () => {
        let recordId = null;

        test('Should create a new record', async () => {
            const result = await MissionController.create({
                name: 'Test mission 1',
                startDate: new Date(),
                endDate: null,
                mode: 'simulation',
                status: 'inactive',
            });
            expect(result).toBeTruthy();
            expect(result.id).toBeDefined();
            recordId = result.id;
        });

        test('Should update a record', async () => {
            expect(recordId).toBeTruthy();
            expect(typeof recordId).toBe('number');
            const result = await MissionController.update(recordId, { name: 'Changed name' });
            expect(result).toBeTruthy();
            expect(result.name).toBe('Changed name');
            expect(result.id).toBe(recordId);
        });

        test('Should remove the test record', async () => {
            expect(recordId).toBeTruthy();
            const result = await MissionController.remove(recordId);
            expect(result).toBeTruthy();
        });
    });

    describe('LIST methods works', () => {
        let createdRecords = [];
        const startDate = [new Date(), new Date()];
        const testFilter = {
            query: 'mock_test',
            status: 'inactive',
            mode: 'simulation',
        };

        beforeAll(async () => {
            for (const mockRecord of mock.list) {
                const createdRecord = await MissionController.create(mockRecord);
                createdRecords.push(createdRecord.id);
            }
        });

        test('Should correctly parse the filter', () => {
            const [conditions, vars] = MissionController.processFilter(testFilter);
            expect(typeof conditions).toBe('string');
            expect(conditions).toBe(`WHERE name LIKE ? AND status = ? AND mode = ?`);
            expect(Array.isArray(vars)).toBe(true);
            expect(vars).toHaveLength(3);
        });

        test('Should list records', async () => {
            const result = await MissionController.list(testFilter, { num: 10, pag: 0, ord: 'name', asc: true });
            expect(result).toBeTruthy();
            expect(Array.isArray(result)).toBe(true);
        });

        test('Should count correctly the existing records', async () => {
            const count = await MissionController.count(testFilter);
            expect(count).toBeTruthy();
            expect(count).toBe(3);
        });

        test('Should list all data while using no filters', async () => {
            const rows = await MissionController.list({}, { num: 10, pag: 0, ord: 'startDate', asc: false });
            console.log(rows);
            expect(rows).toBeDefined();
            expect(rows.length).toBeGreaterThan(0);
        });

        afterAll(async () => {
            for (const createdRecord of createdRecords) {
                await MissionController.remove(createdRecord);
            }
        });
    });
});