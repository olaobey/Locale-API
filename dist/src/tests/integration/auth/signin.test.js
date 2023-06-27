"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable prefer-const */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("@src/app"));
const jest_setup_1 = require("@src/tests/jest.setup");
const jest_teardown_1 = __importDefault(require("@src/tests/jest.teardown"));
const apiKey_service_1 = require("@src/service/apiKey.service");
const user_model_1 = require("@models/user.model"); // Assuming the UserModel import path is correct
// our global object for storing auth information
let auth = {};
// before each request, create a user and log them in
beforeEach(async () => {
    // Clear the user collection before each test
    await user_model_1.UserModel.deleteMany({});
    // Create a test user
    const testUser = new user_model_1.UserModel({
        username: 'olaobey15',
        email: 'olaobey15@gmail.com',
        password: 'password123',
    });
    await testUser.save();
    // Generate an API key for authentication
    const { maskedKey, apiKeyInfo } = await (0, apiKey_service_1.generateAPIKey)(testUser.id);
    // Store the API key and maskedKey in the auth object
    auth.apiKey = apiKeyInfo.apiKey;
    auth.maskedKey = maskedKey;
    // Store the user ID from the token in the auth object
    // auth.current_user_id = testUser.id;
});
beforeAll(async () => {
    await (0, jest_setup_1.connectToDatabase)();
});
afterAll(async () => {
    await (0, jest_teardown_1.default)();
});
describe('Signin Endpoint', () => {
    it('should authenticate the user and return API key', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/login')
            .set('x-api-key', auth.apiKey) // Replace 'YOUR_API_KEY' with the actual API key
            .send({
            username: 'olaobey15',
            // email: 'bovas@gmail.com',
            password: 'password123',
        });
        console.log('Response body:', response.body);
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Login is successful');
        expect(response.body.maskedKey).toBeDefined();
        expect(response.body.apiKey).toBeDefined();
        expect(response.body.apiKeyExpiration).toBeDefined();
    });
    it('should return an error if required fields are missing', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/login')
            .set('x-api-key', auth.apiKey)
            .send({});
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('All fields are required and you need to be verified.');
    });
    it('should return an error if invalid credentials are provided', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/login')
            .set('x-api-key', auth.apiKey)
            .send({
            username: 'olaobey15',
            // email: 'bovas@gmail.com',
            password: 'password123',
        });
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid credentials');
    });
});
