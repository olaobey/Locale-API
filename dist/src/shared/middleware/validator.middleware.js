"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const errors_1 = __importDefault(require("../../shared/utils/errors"));
const validate = (schema, _in) => {
    return (req, _res, next) => {
        try {
            switch (_in) {
                case 'params':
                    schema.parse(req.params);
                    break;
                case 'query':
                    schema.parse(req.query);
                    break;
                default:
                    schema.parse(req.body);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                next(errors_1.default.badRequest('Bad Request', 400, error.issues));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validate = validate;
