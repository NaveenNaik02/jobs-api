import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Job from "../models/Job";
import { UserRequest } from "../types";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors";

const createJob = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body.createdBy = req.user?.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
  } catch (error) {
    next(error);
  }
};

const getAllJobs = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobs = await Job.find({ createdBy: req.user?.userId }).sort(
      "createdAt"
    );
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
  } catch (error) {
    next(error);
  }
};

const getJob = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.userId) {
      throw new UnauthenticatedError("Try Logging Again");
    }
    const {
      user: { userId },
      params: { id: jobId },
    } = req;
    const job = await Job.findOne({
      _id: jobId,
      createdBy: userId,
    });
    if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({ job });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.userId) {
      throw new UnauthenticatedError("Try Logging Again");
    }
    const {
      user: { userId },
      params: { id: jobId },
    } = req;
    const job = await Job.findByIdAndDelete({
      _id: jobId,
      createdBy: userId,
    });
    if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`);
    }
    res
      .status(StatusCodes.OK)
      .send({ message: `deleted a job with id ${jobId}` });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.userId) {
      throw new UnauthenticatedError("Try Logging Again");
    }
    const {
      body: { company, position },
      user: { userId },
      params: { id: jobId },
    } = req;
    if (company === "" || position === "") {
      throw new BadRequestError("Company or Position fields cannot be empty");
    }
    const job = await Job.findByIdAndUpdate(
      {
        _id: jobId,
        createdBy: userId,
      },
      req.body,
      { new: true, runValidators: true }
    );
  } catch (error) {
    next(error);
  }
};
export { createJob, getAllJobs, getJob, deleteJob, updateJob };
