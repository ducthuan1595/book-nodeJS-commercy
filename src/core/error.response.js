'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    UNAUTHORIZED: 401,
    BAD: 400,
    NOT_FOUND: 400
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error',
    UNAUTHORIZED: 'Unauthorized',
    BAD: 'Bad request',
    NOT_FOUND: 'Not found',
}

class ErrorResponse extends Error {
    constructor(message = ReasonStatusCode.FORBIDDEN, status = StatusCode.FORBIDDEN) {
        super(message, status)
        this.status = status
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.BAD, statusCode = StatusCode.BAD) {
        super(message, statusCode)
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode)
    }
}

class AuthorizedFailError extends ErrorResponse {
    constructor(message = ReasonStatusCode.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode)
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN){
        super(message, statusCode)
    }
}

module.exports = {
    ErrorResponse,
    ConflictRequestError,
    AuthorizedFailError,
    BadRequestError,
    NotFoundError,
    ForbiddenError
}