/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// const { pathsToModuleNameMapper } = require('ts-jest/utils');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
// const { compilerOptions } = require('./tsconfig');

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	// moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths /*, { prefix: '<rootDir>/' } */),
	moduleNameMapper: {
		'^@zeronejs/ast-(.*)$': '<rootDir>/packages/ast/$1/src',
		'^@zeronejs/(.*)$': '<rootDir>/packages/$1/src',
	},
	testMatch: ['<rootDir>/packages/**/*.(test|spec).ts'],
	modulePathIgnorePatterns: ['<rootDir>/packages/.*/dist', '<rootDir>/dist'],
	// 不算入覆盖率的文件夹
	coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/', 'dist'],
};
