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
exports.updateJob = exports.deleteJob = exports.getJob = exports.getAllJobs = exports.createJob = void 0;
const http_status_codes_1 = require("http-status-codes");
const Job_1 = __importDefault(require("../models/Job"));
const errors_1 = require("../errors");
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.body.createdBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const job = yield Job_1.default.create(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ job });
});
exports.createJob = createJob;
const getAllJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const jobs = yield Job_1.default.find({ createdBy: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId }).sort("createdAt");
    res.status(http_status_codes_1.StatusCodes.OK).json({ jobs, count: jobs.length });
});
exports.getAllJobs = getAllJobs;
const getJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId) {
        throw new errors_1.UnauthenticatedError("Try Logging Again");
    }
    const { user: { userId }, params: { id: jobId }, } = req;
    const job = yield Job_1.default.findOne({
        _id: jobId,
        createdBy: userId,
    });
    if (!job) {
        throw new errors_1.NotFoundError(`No job with id ${jobId}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ job });
});
exports.getJob = getJob;
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId) {
        throw new errors_1.UnauthenticatedError("Try Logging Again");
    }
    const { user: { userId }, params: { id: jobId }, } = req;
    const job = yield Job_1.default.findByIdAndDelete({
        _id: jobId,
        createdBy: userId,
    });
    if (!job) {
        throw new errors_1.NotFoundError(`No job with id ${jobId}`);
    }
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .send({ message: `deleted a job with id ${jobId}` });
});
exports.deleteJob = deleteJob;
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId) {
        throw new errors_1.UnauthenticatedError("Try Logging Again");
    }
    const { body: { company, position }, user: { userId }, params: { id: jobId }, } = req;
    if (company === "" || position === "") {
        throw new errors_1.BadRequestError("Company or Position fields cannot be empty");
    }
    const job = yield Job_1.default.findByIdAndUpdate({
        _id: jobId,
        createdBy: userId,
    }, req.body, { new: true, runValidators: true });
});
exports.updateJob = updateJob;
//# sourceMappingURL=jobs.js.map