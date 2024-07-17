import bcrypt from "bcrypt";
import { permissions } from "./../constant/Permission";
import { getUserByEmail } from "./user";
import { User } from "../interface/user";
import { BaseModel } from "./BaseModel";

export class UserModel extends BaseModel {
  static async create(user: User) {
    const password = await bcrypt.hash(user.password, 10);
    const userToCreate = {
      name: user.name,
      email: user.email,
      password,
    };
    return await this.queryBuilder()
      .insert(userToCreate)
      .table("users")
      .returning("*");
  }

  static async getByEmail(email: string) {
    const result = await this.queryBuilder()
      .select("*")
      .from("users")
      .where("email", email)
      .first();
    return result;
  }

  // static async rolePermission(userId: number) {
  //   return await this.queryBuilder()
  //     .select("*")
  //     .from("your_table_name")
  //     .where("user_id", userId);
  // }

  // static async getRolesPermissions(userId: number) {
  //   try {
  //     const result = await this.queryBuilder()
  //       .select("roles.id as role_id")
  //       .from("userRoles")
  //       .leftJoin("roles", "userRoles.role_id", "roles.id")
  //       .where("userRoles.user_id", userId);
  //     return result;
  //   } catch (error) {
  //     console.error("Error fetching roles and permissions:", error);
  //     throw error;
  //   }
  // }
  static async getRoleId(userId: number) {
    try {
      const result = await this.queryBuilder()
        .select("roles.id as role_id")
        .from("user_roles")
        .leftJoin("roles", "user_roles.role_id", "roles.id")
        .where("user_roles.user_id", userId);
      return result;
    } catch (error) {
      console.error("Error fetching roles and permissions:", error);
      throw error;
    }
  }

  static async getRoleName(roleId: number) {
    console.log("roleId", roleId);
    const result = await this.queryBuilder()
      .select("*")
      .from("roles")
      .where("id", roleId);
    return result;
  }
  static async getPermissionIds(roleId: number) {
    console.log("id before role", roleId);
    const result = await this.queryBuilder()
      .select("id")
      .from("role-permissions")
      .where("role_id", roleId);
    return result;
  }
  static async getPermissionNames(permissionsIds: { id: number }[]) {
    const permissionIds = permissionsIds.map((item) => item.id);
    console.log("permussuon id before inserting", permissionIds);
    const result = await this.queryBuilder()
      .select("permission")
      .from("permissions")
      .whereIn("id", permissionIds);

    return result;
  }
}
