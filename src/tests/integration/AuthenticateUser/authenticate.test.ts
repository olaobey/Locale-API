/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */
import request from 'supertest';
import app from '@src/app';
import { connectToDatabase } from '@src/tests/jest.setup';
import closeDatabase from '@src/tests/jest.teardown';
import { UserModel } from '@models/user.model';

describe('authenticateUser', () => {
    beforeAll(async () => {
        // Connect to the database
        await connectToDatabase();

        // Create a test user with a valid API key
        await UserModel.create({
            email: 'yemiosibajo2@gmail.com',
            password: 'equation',
            _id: '6498323216f90f29fa0aa4b9',
            apiKey: '$2b$10$Bm4yWJzoTE.JF.XFJjJuAO9Xzl2nj7sUkLkrnpMYL7MYGMhGhJ6Ca',
        });
    });

    afterAll(async () => {
        // Clean up the database
        await UserModel.deleteMany({});

        // Close the database connection
        await closeDatabase();
    });

    it('should authenticate a user with a valid API key', async () => {
        const response = await request(app)
            .get('/api/vi/local/getById')
            .set('x-api-key', '$2b$10$Bm4yWJzoTE.JF.XFJjJuAO9Xzl2nj7sUkLkrnpMYL7MYGMhGhJ6Ca');

        // Expect the response status to be 200
        expect(response.status).toBe(200);

        // Expect the response body or any other validation you need
        expect(response.body).toEqual({
            message: 'Get all local by ID',
        });
    });

    it('should handle authentication failure with an invalid API key', async () => {
        const response = await request(app)
            .get('/api/vi/local/getById')
            .set('x-api-key', '$2b$10$Bm4yWJzoTE.JF.XFJjJuAO9Xzl2nj7sUkLkrnpMYL7MYGMhGhJ6Ca');

        // Expect the response status to be 401
        expect(response.status).toBe(401);

        // Expect the response body or any other validation you need
        expect(response.body).toEqual({
            message: 'Invalid credentials',
        });
    });

    it('should handle missing API key', async () => {
        const response = await request(app).get('/api/vi/local/getById');

        // Expect the response status to be 401
        expect(response.status).toBe(401);

        // Expect the response body or any other validation you need
        expect(response.body).toEqual({
            message: 'Invalid credentials',
        });
    });
});
