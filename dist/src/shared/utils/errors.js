"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable indent */
class APIError extends Error {
    constructor(message = 'Unknown Error', status = 500, data = undefined) {
        super(message);
        this.status = status;
        this.data = data;
    }
    static notFound(msg = 'Resources Not Found', status = 404) {
        return new this(msg, status);
    }
    static unauthorized(msg = "Sorry, you don't have the right permission to view the resources", status = 403) {
        return new this(msg, status);
    }
    static unauthenticated(msg = 'Sorry, you need to login first', status = 401) {
        return new this(msg, status);
    }
    static badRequest(msg = 'Bad request', status = 400, data = undefined) {
        return new this(msg, status, data);
    }
}
exports.default = APIError;
