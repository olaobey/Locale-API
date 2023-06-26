/* eslint-disable import/extensions */
/* eslint-disable import/order */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-unresolved */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import app from '@src/app';
import { UserModel } from '@models/user.model';
import { connectToDatabase } from '@src/tests/jest.setup';
import closeDatabase from '@src/tests/jest.teardown';

beforeAll(async () => {
    await connectToDatabase();
});

afterAll(async () => {
    await closeDatabase();
});

describe('Signup Endpoint', () => {
    beforeEach(async () => {
        // Clear the users collection before each test
        await UserModel.deleteMany({});
    });

    it('should create a new user', async () => {
        const userData = {
            username: 'olaobey',
            email: 'olaobey@gmail.com',
            password: 'password123',
        };

        const response = await request(app).post('/api/v1/auth/register').send(userData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('SignUp successfully');
        expect(response.body.newUser).toBeDefined();

        // Check if the user is saved in the database
        const savedUser = await UserModel.findOne({ email: userData.email }).exec();
        expect(savedUser).not.toBeNull();
        if (savedUser) {
            expect(savedUser.username).toBe(userData.username);
            expect(savedUser.email).toBe(userData.email);
        }
    });

    it('should return an error if required fields are missing', async () => {
        const response = await request(app).post('/api/v1/auth/register').send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('All fields are required and you need to be verified.');
    });

    it('should return an error if user already exists', async () => {
        const existingUser = new UserModel({
            username: 'olaobey',
            email: 'olaobey@gmail.com',
            password: 'password123',
        });
        await existingUser.save();

        const response = await request(app).post('/api/v1/auth/register').send({
            username: 'olaobey',
            email: 'olaobey@gmail.com',
            password: 'password123',
        });

        console.log(response.body);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        // expect(response.body.message).toBe('User already exists');
        // expect(response.body).toHaveProperty('message', 'Unknown Error Occurred');
    });
});
