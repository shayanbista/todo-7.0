import httpStatusCodes from "http-status-codes";
import { Request } from "../interface/request";
import { NextFunction, Response } from "express";
import * as taskService from "../service/task";
import { Roles } from "../constant/Roles";
import { BadRequestError } from "../error/BadRequestError";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("auth controller");

export const addTask = async (req: Request, res: Response) => {
  const newTask = req.body;
  const userId = req.user?.id!;

  const task = await taskService.addTask(newTask, userId);

  logger.info("task add");
  res.status(httpStatusCodes.CREATED).json({ message: "Succesfully added!" });
};

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id!;

  const tasks = await taskService.getTasks(Number(userId));
  console.log("tasks11", tasks);

  if (!tasks) {
    next(new BadRequestError(`Task with following  id ${userId} doesnt exist`));
    return;
  }

  res.status(httpStatusCodes.OK).json({ message: tasks });
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const userId = req.user?.id!;
  const data = req.body;
  console.log("data", data);

  const updatedTask = await taskService.updateTask(Number(id), data, userId);
  if (!updatedTask) {
    next(new BadRequestError(`Task with following id: ${id} doesnt exist`));
    return;
  }
  res.status(httpStatusCodes.OK).json({ message: "Updated successfully!" });
};

export const deleteTask = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id!;

  const deleteTask = taskService.deleteTask(Number(id), userId);
  logger.info("task deleted");

  if (!deleteTask) {
    next(new BadRequestError(`Task with following id: ${id} doesnt exist`));
    return;
  }

  res.status(httpStatusCodes.OK).json({ message: "deleted successfully!" });
};
