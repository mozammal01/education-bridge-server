import { NextFunction, Request, Response } from "express"
import { Prisma } from "@prisma/client";
import AppError from "../errors/AppError.js";

function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong!";
    let errorSources: any = err;

    // Custom AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // PrismaClientValidationError
    else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Validation Error: Incorrect field type or missing fields!";
    }
    // PrismaClientKnownRequestError
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = 404;
            message = "Record not found!";
        }
        else if (err.code === "P2002") {
            statusCode = 400;
            message = "Duplicate entry detected!";
        }
        else if (err.code === "P2003") {
            statusCode = 400;
            message = "Foreign key constraint failed!";
        }
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errorSources: process.env.NODE_ENV === 'development' ? errorSources : null,
        stack: process.env.NODE_ENV === 'development' ? err?.stack : null,
    });
}

export default errorHandler;