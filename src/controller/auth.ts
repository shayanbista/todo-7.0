import httpStatusCodes from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import * as authServices from "../service/auth";
import { BadRequestError } from "../error/BadRequestError";
import { ConflictError } from "../error/ConflictError";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("auth controller");

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const data = await authServices.login(body);
  console.log("data", data);
  if (data) {
    res.status(httpStatusCodes.OK).json({ message: data });
  } else {
    logger.info("logged in");
    next(new BadRequestError(`following  id doesnt exist`));
    return;
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next(new BadRequestError("No token provided."));
  }
  const result = await authServices.refreshToken(authorization!);
  logger.info("result", result);
  res.status(httpStatusCodes.OK).json(result);
};
