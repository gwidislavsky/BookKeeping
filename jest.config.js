module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  testTimeout: 30000,
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      isolatedModules: true
    }]
  },
  maxWorkers: 1,
  globals: {
    NODE_ENV: 'test'
  },
  setupFilesAfterEnv: ['./jest.setup.js']
};