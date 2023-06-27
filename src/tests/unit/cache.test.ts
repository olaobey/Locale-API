/* eslint-disable indent */
/* eslint-disable no-undef */
import checkCache from '@shared/middleware/cache.middleware';

describe('checkCache middleware', () => {
    const cacheMock = {
        get: jest.fn(),
    };

    const req = { params: { id: 'exampleId' } };
    const res = {};
    const next = jest.fn();

    it('should send the cached response if data is found in the cache', () => {
        checkCache(cacheMock)(req, res, next);

        expect(cacheMock.get).toHaveBeenCalledWith('cache:exampleId');
        expect(res.json).toHaveBeenCalledWith({ id: 'exampleId', name: 'John Doe' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should proceed to the next middleware if data is not found in the cache', () => {
        cacheMock.get.mockReturnValue(null);

        checkCache(cacheMock)(req, res, next);

        expect(cacheMock.get).toHaveBeenCalledWith('cache:exampleId');
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it('should respond with an error if there is a Redis cache error', () => {
        cacheMock.get.mockImplementation(() => {
            throw new Error('Cache error');
        });

        checkCache(cacheMock)(req, res, next);

        expect(cacheMock.get).toHaveBeenCalledWith('cache:exampleId');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        expect(next).not.toHaveBeenCalled();
    });
});
