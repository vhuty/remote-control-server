'use strict';

const _error = (message = 'unknown', status = 500) => {
    return { stack: Error().stack, status, message }
};

module.exports = {
    badRequest: (message = 'Bad request') => {
        return _error(message, 400);
    },
    
    unauthorized: (message = 'Unauthorized') => {
        return _error(message, 401);
    }
}