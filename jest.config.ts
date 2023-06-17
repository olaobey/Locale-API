/** @type {import('ts-jest').JestConfigWithTsJest} */
export default async () => {
    return {
        preset: 'ts-jest',
        displayName: {
            name: 'Locale API',
            color: 'greenBright',
        },
        testEnvironment: 'node',
        verbose: true,
        setupFiles: ['dotenv/config'],
        testMatch: ['**/**/*.test.ts'],
        detectOpenHandles: true,
        collectCoverage: true,
        transform: { '^.+\\.tsx?$': 'ts-jest' },
        globalTeardown: '<rootDir>/src/tests/jest-globals-teardown.ts',
        forceExit: true,
    };
};
