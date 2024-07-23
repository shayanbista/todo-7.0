import { Iquery } from "./../interface/query";
import { Todo } from "../interface/task";

import loggerWithNameSpace from "../utils/logger";

import * as userService from "./user";
import * as taskModel1 from "../model/TaskModel";

const logger = loggerWithNameSpace("TaskModel");

export const addTask = async (newTask: Todo, userId: number) => {
  const existingUser = await userService.getUserById(userId);
  if (!existingUser) return null;
  const task = taskModel1.TaskModel.create(newTask, userId);
  logger.info("task added");
  return task;
};

export const getTasks = async (q: Iquery, userId: number) => {
  const tasks = await taskModel1.TaskModel.getById(q, userId);
  console.log("returned task", tasks);
  if (!tasks) return null;
  logger.info("Tasks returned");
  return tasks;
};

export const updateTask = async (
  id: number,
  updatedData: Todo,
  userId: number
) => {
  const task = await taskModel1.TaskModel.findById(id, userId);
  if (!task) return null;

  console.log("service updated data", updatedData);

  const updatedTask = await taskModel1.TaskModel.update(
    id,
    updatedData,
    userId
  );
  logger.info("task updated");
  return updatedTask;
};

export const deleteTask = async (id: number, userId: number) => {
  const task = await taskModel1.TaskModel.findById(id, userId);
  if (!task) return null;
  const index = await taskModel1.TaskModel.delete(id);

  if (!index) return false;
  logger.info("task deleted");
  return true;
};
