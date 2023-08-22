"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    automock: true,
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.{js,jsx}",
        "**/*.{ts,tsx}",
        "!**/node_modules/**",
        "!**/vendor/**",
    ],
    coverageProvider: "babel",
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    maxConcurrency: 5,
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true
};
exports.default = config;
