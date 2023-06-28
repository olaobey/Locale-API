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
/* eslint-disable import/extensions */
/* eslint-disable import/order */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-unresolved */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("@src/app"));
const user_model_1 = require("@models/user.model");
const jest_setup_1 = require("@src/tests/jest.setup");
const jest_teardown_1 = __importDefault(require("@src/tests/jest.teardown"));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, jest_setup_1.connectToDatabase)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, jest_teardown_1.default)();
}));
describe('Signup Endpoint', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clear the users collection before each test
        yield user_model_1.UserModel.deleteMany({});
    }));
    it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            username: 'olaobey',
            email: 'olaobey@gmail.com',
            password: 'password123',
        };
        const response = yield (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send(userData);
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('SignUp successfully');
        expect(response.body.newUser).toBeDefined();
        // Check if the user is saved in the database
        const savedUser = yield user_model_1.UserModel.findOne({ email: userData.email }).exec();
        expect(savedUser).not.toBeNull();
        if (savedUser) {
            expect(savedUser.username).toBe(userData.username);
            expect(savedUser.email).toBe(userData.email);
        }
    }));
    it('should return an error if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({});
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('All fields are required and you need to be verified.');
    }));
    it('should return an error if user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = new user_model_1.UserModel({
            username: 'olaobey',
            email: 'olaobey@gmail.com',
            password: 'password123',
        });
        yield existingUser.save();
        const response = yield (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
            username: 'olaobey',
            email: 'olaobey@gmail.com',
            password: 'password123',
        });
        console.log(response.body);
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        // expect(response.body.message).toBe('User already exists');
        // expect(response.body).toHaveProperty('message', 'Unknown Error Occurred');
    }));
});
