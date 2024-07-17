import { permissions } from "./../constant/Permission";
import { User } from "./../interface/user";
import { UserModel } from "./../model/UserModel";
import bcrypt from "bcrypt";
import * as userModel from "../model/user";
import { Roles } from "../constant/Roles";

import loggerWithNameSpace from "../utils/logger";
import { BadRequestError } from "../error/BadRequestError";
import * as UserModel1 from "../model/UserModel";

const logger = loggerWithNameSpace("User Service");

export const createUser = async (user: User) => {
  const existingUser = await UserModel1.UserModel.getByEmail(user.email);
  if (existingUser) return null;
  const newUser = await UserModel1.UserModel.create(user);
  if (!newUser) {
    return null;
  }

  const userId = newUser[0].id;

  // const setRoleId = UserModel1.UserModel.setRole(userId);
  console.log("newUser", newUser);
  // const userId = newUser[
  // const setRoleId = await UserModel1.UserModel.setRoleId(user);

  return true;
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
  // console.log("roleId inside the service", roleId);
  // const permissions = await UserModel1.UserModel.getPermissionIds(roleId);
  // const permissionIds = permissions.map((id) => {
  //   return id;
  // });
  // console.log("permissionIds", permissionIds);
  // const permissionNames = await UserModel1.UserModel.getPermissionNames(
  //   permissionIds
  // );
  // console.log("permission names", permissionNames);
  // return permissionNames;

  const permissions = UserModel1.UserModel.getRolePermissions(roleId);
  return permissions;
};

export const getUsers = () => {
  const users = userModel.getUsers();
  if (users.length == 0) {
    return null;
  } else return users;
};

export const getUserByEmail = async (email: string) => {
  return await UserModel1.UserModel.getByEmail(email);
};

export const getUserById = (id: number) => {
  const user = userModel.getUserById(id);
  if (!user) return null;
  return user;
};

export const updateUser = async (id: number, user: User) => {
  let password: string;

  // find the index of user
  const usersIndex = userModel.findUserIndex(id);

  if (usersIndex === -1) {
    throw new BadRequestError("user not found");
  }
  const existingUser = userModel.getUserByIndexId(id);

  // check the password from request
  if (user.password) {
    password = await bcrypt.hash(user.password, 10);
  } else {
    password = existingUser.password;
  }
  logger.info("password", password);
  user.password = password;
  userModel.updateUser(id, user, usersIndex);
  return { message: "User updated" };
};

export const deleteUser = (id: number) => {
  const userIndex = userModel.findUserIndex(id);
  if (userIndex === -1) throw new BadRequestError("user not found");
  userModel.deleteUser(userIndex);
  logger.info("User deleted");
  return { message: "users deleted" };
};
