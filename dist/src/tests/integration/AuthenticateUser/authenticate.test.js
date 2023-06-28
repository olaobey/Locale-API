"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("@src/app"));
const jest_setup_1 = require("@src/tests/jest.setup");
const jest_teardown_1 = __importDefault(require("@src/tests/jest.teardown"));
const user_model_1 = require("@models/user.model");
describe('authenticateUser', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Connect to the database
        yield (0, jest_setup_1.connectToDatabase)();
        // Create a test user with a valid API key
        yield user_model_1.UserModel.create({
            email: 'yemiosibajo2@gmail.com',
            password: 'equation',
            _id: '6498323216f90f29fa0aa4b9',
            apiKey: '$2b$10$Bm4yWJzoTE.JF.XFJjJuAO9Xzl2nj7sUkLkrnpMYL7MYGMhGhJ6Ca',
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up the database
        yield user_model_1.UserModel.deleteMany({});
        // Close the database connection
        yield (0, jest_teardown_1.default)();
    }));
    it('should authenticate a user with a valid API key', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/vi/local/getById')
            .set('x-api-key', '$2b$10$Bm4yWJzoTE.JF.XFJjJuAO9Xzl2nj7sUkLkrnpMYL7MYGMhGhJ6Ca');
        // Expect the response status to be 200
        expect(response.status).toBe(200);
        // Expect the response body or any other validation you need
        expect(response.body).toEqual({
            message: 'Get all local by ID',
        });
    }));
    it('should handle authentication failure with an invalid API key', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/vi/local/getById')
            .set('x-api-key', '$2b$10$Bm4yWJzoTE.JF.XFJjJuAO9Xzl2nj7sUkLkrnpMYL7MYGMhGhJ6Ca');
        // Expect the response status to be 401
        expect(response.status).toBe(401);
        // Expect the response body or any other validation you need
        expect(response.body).toEqual({
            message: 'Invalid credentials',
        });
    }));
    it('should handle missing API key', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/api/vi/local/getById');
        // Expect the response status to be 401
        expect(response.status).toBe(401);
        // Expect the response body or any other validation you need
        expect(response.body).toEqual({
            message: 'Invalid credentials',
        });
    }));
});
