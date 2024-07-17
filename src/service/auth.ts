import { permissions } from "./../constant/Permission";
import { sign, verify } from "jsonwebtoken";
import { User } from "../interface/user";
import bcrypt from "bcrypt";
import config from "../config";

import * as userService from "./user";

interface CustomJwtPayload {
  email: string;
  id: string;
}

export const login = async (body: Pick<User, "email" | "password">) => {
  const existingUser = await userService.getUserByEmail(body.email);
  let roleId;
  let roleName;

  if (!existingUser) {
    return null;
  }

  console.log("existinguser", existingUser);

  const userId = existingUser.id;

  const role = await userService.getRoles(userId);
  if (!role) return null;

  role.map((items: { id: string; roleName: string }) => {
    roleId = items.id;
    roleName = items.roleName;
  });

  const permissions = await userService.getPermissions(roleId!);
  console.log("permissions", permissions);

  if (!permissions) return null;

  const isvalidPassword = await bcrypt.compare(
    body.password,
    existingUser.password
  );

  if (!isvalidPassword) {
    return null;
  }
  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    permissions: permissions,
    role: roleName,
  };

  console.log("payload", payload);

  const s = config.jwt.secret!;
  const accessToken = sign(payload, s, {
    expiresIn: config.jwt.accessExpiration,
  });

  const refreshToken = sign(payload, s, {
    expiresIn: config.jwt.refreshTokenExpiration,
  });
  return { accessToken, refreshToken };
};

// export const refreshToken = async (token: string) => {
//   try {
//     const decoded = verify(token, config.jwt.secret!) as CustomJwtPayload;

//     const existingUser = await userService.getUserByEmail(
//       decoded.email as string
//     );

//     if (!existingUser) {
//       return { error: "Invalid token" };
//     }

//     const payload = {
//       id: existingUser.id,
//       name: existingUser.name,
//       email: existingUser.email,
//     };

//     const newAccessToken = sign(payload, config.jwt.secret!, {
//       expiresIn: config.jwt.accessExpiration,
//     });

//     const newRefreshToken = sign(payload, config.jwt.secret!, {
//       expiresIn: config.jwt.refreshTokenExpiration,
//     });

//     return { accessToken: newAccessToken, refreshToken: newRefreshToken };
//   } catch (err) {
//     return err;
//   }
// };
