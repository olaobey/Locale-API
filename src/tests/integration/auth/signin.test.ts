/* eslint-disable prefer-const */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import app from '@src/app';
import { connectToDatabase } from '@src/tests/jest.setup';
import closeDatabase from '@src/tests/jest.teardown';
import { generateAPIKey } from '@src/service/apiKey.service';
import { UserModel } from '@models/user.model'; // Assuming the UserModel import path is correct

// Define the type for the auth object
interface Auth {
    maskedKey?: string;
    apiKey?: string;
    current_user_id?: string;
}

// our global object for storing auth information
let auth: Auth = {};

// before each request, create a user and log them in
beforeEach(async () => {
    // Clear the user collection before each test
    await UserModel.deleteMany({});

    // Create a test user
    const testUser = new UserModel({
        username: 'olaobey15',
        email: 'olaobey15@gmail.com',
        password: 'password123',
    });
    await testUser.save();

    // Generate an API key for authentication
    const { maskedKey, apiKeyInfo } = await generateAPIKey(testUser.id);

    // Store the API key and maskedKey in the auth object
    auth.apiKey = apiKeyInfo.apiKey;
    auth.maskedKey = maskedKey;
    // Store the user ID from the token in the auth object
    // auth.current_user_id = testUser.id;
});
beforeAll(async () => {
    await connectToDatabase();
});

afterAll(async () => {
    await closeDatabase();
});

describe('Signin Endpoint', () => {
    it('should authenticate the user and return API key', async () => {
        const response = await request(app)
            .post('/api/v1/auth/login')
            .set('x-api-key', auth.apiKey as string) // Replace 'YOUR_API_KEY' with the actual API key
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
        const response = await request(app)
            .post('/api/v1/auth/login')
            .set('x-api-key', auth.apiKey as string)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('All fields are required and you need to be verified.');
    });

    it('should return an error if invalid credentials are provided', async () => {
        const response = await request(app)
            .post('/api/v1/auth/login')
            .set('x-api-key', auth.apiKey as string)
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
