const { StatusCodes } = require('http-status-codes'); 

class ServiceError extends Error {
    constructor(
        message = 'Something Went Wrong', 
        explanation = 'Service layer Error', 
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super();
        this.name = 'ServiceError';
        this.message = message;
        this.explanation = explanation;
        this.statusCode = statusCode;
    }
}

module.exports = ServiceError;