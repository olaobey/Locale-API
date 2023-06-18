/* eslint-disable import/newline-after-import */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-unresolved */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import express from 'express';
import { connectDB, disconnectDB } from '@src/shared/utils/db';
const app = express();

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await disconnectDB();
});

describe('Signup Endpoint', () => {
    it('should create a new user', async () => {
        const response = await request(app).post('/signup').send({
            username: 'olaobey',
            email: 'olaobey@gmail.com',
            password: 'password123',
        });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('SignUp successfully');
        expect(response.body.newUser).toBeDefined();
    });

    it('should return an error if required fields are missing', async () => {
        const response = await request(app).post('/signup').send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('All fields are required and you need to be verified.');
    });

    it('should return an error if user already exists', async () => {
        const response = await request(app).post('/signup').send({
            username: 'olaobey',
            email: 'olaobey@gmail.com',
            password: 'password123',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User already exists');
    });
});
