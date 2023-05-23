import MetricController from "../../../main/controllers/MetricController";
import mock from '../../../mocks/metrics';

describe('Metric controller tests', () => {

    describe('CRUD works', () => {
        let recordId = null;

        test('Should create a new record', async () => {
            const result = await MetricController.create({
                valid: false,
                packet: 'LAIKA1,778.29,29.79,2170.63,-0.72,0.05,-1.07,844,-284,14952,0.05,-0.02,0.91,0.00,0.00,0.00,',
                mission: 10,
            });
            expect(result).toBeTruthy();
            expect(result.id).toBeDefined();
            expect(typeof result.id).toBe('number');
            expect(result.created).toBe(true);
            recordId = result.id;
        });

        test('Should remove the test record', async () => {
            expect(recordId).toBeTruthy();
            const result = await MetricController.remove(recordId);
            expect(result).toBeTruthy();
        });
    });

    describe('LIST methods works', () => {
        let createdRecords = [];
        const timestamp = [new Date(), new Date()];
        const testFilter = {
            valid: false,
            mission: 10
        };

        beforeAll(async () => {
            for (const mockRecord of mock.list) {
                const createdRecord = await MetricController.create(mockRecord);
                createdRecords.push(createdRecord.id);
            }
        });

        test('Should correctly parse the filter', () => {
            const [conditions, vars] = MetricController.processFilter(testFilter);
            expect(typeof conditions).toBe('string');
            expect(conditions).toBe(`WHERE mission = ? AND valid = ?`);
            expect(Array.isArray(vars)).toBe(true);
            expect(vars).toHaveLength(2);
        });

        test('Should list records', async () => {
            const result = await MetricController.list(testFilter, { num: 10, pag: 0, ord: 'timestamp', asc: true });
            expect(result).toBeTruthy();
            expect(Array.isArray(result)).toBe(true);
        });

        test('Should count correctly the existing records', async () => {
            const count = await MetricController.count(testFilter);
            expect(count).toBeTruthy();
            expect(count).toBe(7);
        });

        test('Should list all data while using no filters', async () => {
            const rows = await MetricController.list({}, { num: 10, pag: 0, ord: 'timestamp', asc: false });
            expect(rows).toBeDefined();
            expect(rows.length).toBeGreaterThan(0);
        });

        afterAll(async () => {
            for (const createdRecord of createdRecords) {
                await MetricController.remove(createdRecord);
            }
        });
    });
});