import { ApiError } from '../utils/ApiError.js';

export function validate(schema) {
    return (req, _res, next) => {
        const result = schema(req);

        if (result?.error) {
            return next(new ApiError(400, result.error));
        }

        return next();
    };
}
