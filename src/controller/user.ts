import { NextFunction, Response } from "express";
import { Request } from "../interface/request";
import * as userService from "../service/user";
import httpStatusCodes from "http-status-codes";
import loggerWithNameSpace from "../utils/logger";
import { ConflictError } from "../error/ConflictError";
import { BadRequestError } from "../error/BadRequestError";

const logger = loggerWithNameSpace("user controller");

export async function getUsers(
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info("Fetching all users");
    const { query } = req;
    res.status(httpStatusCodes.OK).json(await userService.getUsers(query));
  } catch (e) {
    logger.error("Error fetching users", { error: e });
    next(e);
  }
}

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return next(new BadRequestError("Invalid user ID"));
    }

    const user = await userService.getUserById(Number(id));
    console.log("user", user);

    if (!user) {
      return next(new BadRequestError("User does not exist"));
    }

    res.status(httpStatusCodes.OK).json({ message: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const data = await userService.createUser(body);
  if (!data) {
    next(new ConflictError("email already exists"));
  }
  res.status(httpStatusCodes.CREATED).json({ message: "created successfully" });
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const data = req.body;

  const user = await userService.updateUser(Number(id), data);

  if (!user) {
    next(new BadRequestError("id doesnot exist"));
  }
  res.status(httpStatusCodes.OK).json({ message: user });
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id);
  const message = await userService.deleteUser(id);
  console.log("messae", message);
  res.status(httpStatusCodes.OK).json({ message });
};
