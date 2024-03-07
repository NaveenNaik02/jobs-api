"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errorHandleMiddleware = (error, _req, res, _next) => {
    console.log("error middleware");
    const customError = {
        statusCode: error.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "Something went wrong try again",
    };
    if (error.name === "ValidationError") {
        customError.message = Object.values(error.errors)
            .map((item) => item.message)
            .join(",");
    }
    if (error.code && error.code === 1100) {
        customError.message = `Duplicate values entered for ${Object.keys(error.keyValue)} field, please choose another value`;
        customError.statusCode = 400;
    }
    if (error.name === "CastError") {
        customError.message = `No item found with id : ${error.value}`;
        customError.statusCode = 404;
    }
    return res
        .status(customError.statusCode)
        .json({ message: customError.message });
};
exports.default = errorHandleMiddleware;
//# sourceMappingURL=error-handler.js.map