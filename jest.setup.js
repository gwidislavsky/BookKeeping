const { closeDB } = require('./src/config/db');

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

afterAll(async () => {
  await closeDB();
});
