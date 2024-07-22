import { permissions } from "./../constant/Permission";
import { sign, verify } from "jsonwebtoken";
import { User } from "../interface/user";
import bcrypt from "bcrypt";
import config from "../config";

import * as userService from "./user";
import { BadRequestError } from "../error/BadRequestError";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("auth service");

interface CustomJwtPayload {
  email: string;
  id: string;
}

export const login = async (body: Pick<User, "email" | "password">) => {
  const existingUser = await userService.getUserByEmail(body.email);
  let roleId;
  let roleName;

  if (!existingUser) {
    logger.info("null data");
    return null;
  }

  const userId = existingUser.id;

  const role = await userService.getRoles(userId);
  logger.info("null data");
  if (!role) return null;

  role.map((items: { id: string; roleName: string }) => {
    roleId = items.id;
    roleName = items.roleName;
  });

  const permissions = await userService.getPermissions(roleId!);

  if (!permissions) return null;

  const isvalidPassword = await bcrypt.compare(
    body.password,
    existingUser.password
  );

  if (!isvalidPassword) {
    logger.info("null data");
    return null;
  }
  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    permissions: permissions,
    role: roleName,
  };
  logger.info("payload", payload);

  const secretKey = config.jwt.secret!;
  const accessToken = sign(payload, secretKey, {
    expiresIn: config.jwt.accessExpiration,
  });

  const refreshToken = sign(payload, secretKey, {
    expiresIn: config.jwt.refreshTokenExpiration,
  });
  return { accessToken, refreshToken };
};

export const refreshToken = async (authToken: string) => {
  const token = authToken.split(" ");
  if (token.length !== 2 || token[0] !== "Bearer") {
    const error = new BadRequestError("No Bearer token provided.");
    throw error;
  }
  let bearerToken = token[1];

  try {
    const decoded = verify(bearerToken, config.jwt.secret!) as CustomJwtPayload;
    logger.info("decoded", decoded);

    const existingUser = await userService.getUserByEmail(
      decoded.email as string
    );

    if (!existingUser) {
      return new BadRequestError("no user");
    }

    const payload = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    };

    const newAccessToken = sign(payload, config.jwt.secret!, {
      expiresIn: config.jwt.accessExpiration,
    });

    const newRefreshToken = sign(payload, config.jwt.secret!, {
      expiresIn: config.jwt.refreshTokenExpiration,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (err) {
    return new Error("internal server error");
  }
};
