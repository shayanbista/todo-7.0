import { User } from "./../interface/user";
import { Iquery } from "../interface/query";

import loggerWithNameSpace from "../utils/logger";
import * as UserModel1 from "../model/UserModel";

const logger = loggerWithNameSpace("User Service");

export const getUsers = async (q: Iquery) => {
  const users = await UserModel1.UserModel.get(q);
  return users;
};

export const createUser = async (user: User) => {
  const existingUser = await UserModel1.UserModel.getByEmail(user.email);
  if (existingUser) return null;
  const newUser = await UserModel1.UserModel.create(user);
  if (!newUser) {
    return null;
  }

  const userId = newUser[0].id;
  const roleId = 1;

  const setRole = await UserModel1.UserModel.setRole(userId, roleId);
  console.log("setRole", setRole);
  return setRole;
};

export const getRoles = async (userId: number) => {
  const id = await UserModel1.UserModel.getRoleId(userId);
  if (!id) return null;

  console.log("id", id);

  const roleId = id[0]?.roleId;

  const roleName = await UserModel1.UserModel.getRoleName(roleId);

  return roleName;
};

export const getPermissions = async (roleId: number) => {
  const permissions = UserModel1.UserModel.getRolePermissions(roleId);
  return permissions;
};

export const getUserByEmail = async (email: string) => {
  return await UserModel1.UserModel.getByEmail(email);
};

export const getUserById = async (id: number) => {
  const user = UserModel1.UserModel.getById(id);
  return user;
};

export const updateUser = async (id: number, user: User) => {
  const existingUser = await UserModel1.UserModel.getById(id);
  if (!existingUser) return null;

  const updatedUser = await UserModel1.UserModel.update(id, user);
  return updatedUser;
};

export const deleteUser = async (id: number) => {
  const existingUser = await UserModel1.UserModel.getById(id);
  if (!existingUser) return null;
  logger.info("User deleted");
  const deletedUser = await UserModel1.UserModel.delete(id);
  return true;
};
