"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../models/User"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.create(Object.assign({}, req.body));
        const token = user.createJWT();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ user: { name: user.name }, token });
    }
    catch (error) {
        if (error instanceof mongoose_1.Error.ValidationError) {
            const validationErrors = Object.values(error.errors).map((error) => error.message);
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ errors: validationErrors });
        }
        else if (error instanceof mongodb_1.MongoError && error.code === 11000) {
            return res
                .status(http_status_codes_1.StatusCodes.CONFLICT)
                .json({ message: "Email already exists" });
        }
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "something went wrong please ty again" });
    }
});
exports.default = register;
//# sourceMappingURL=auth.js.map