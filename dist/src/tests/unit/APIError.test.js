"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/extensions */
/* eslint-disable no-undef */
/* eslint-disable indent */
/* eslint-disable import/no-extraneous-dependencies */
const errors_1 = __importDefault(require("../../shared/utils/errors"));
describe('APIError', () => {
    describe('notFound', () => {
        it('should create a not found error with status 404', () => {
            const error = errors_1.default.notFound('Resource not found');
            expect(error.message).toBe('Resource not found');
            expect(error.status).toBe(404);
        });
    });
    describe('unauthorized', () => {
        it('should create an unauthorized error with status 403', () => {
            const error = errors_1.default.unauthorized('Unauthorized access');
            expect(error.message).toBe('Unauthorized access');
            expect(error.status).toBe(403);
        });
    });
    describe('unauthenticated', () => {
        it('should create an unauthenticated error with status 401', () => {
            const error = errors_1.default.unauthenticated('Unauthenticated user');
            expect(error.message).toBe('Unauthenticated user');
            expect(error.status).toBe(401);
        });
    });
    describe('badRequest', () => {
        it('should create a bad request error with status 400', () => {
            const data = { field: 'email', message: 'Invalid email format' };
            const error = errors_1.default.badRequest('Bad request', 400, data);
            expect(error.message).toBe('Bad request');
            expect(error.status).toBe(400);
            expect(error.data).toEqual(data);
        });
    });
});
