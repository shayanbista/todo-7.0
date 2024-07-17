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

  static async getById(id: number) {
    const result = await this.queryBuilder()
      .select("*")
      .from("users")
      .where("id", id)
      .first();
    return result;
  }

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

    console.log("result permission", result);

    return result;
  }

  static async getRolePermissions(roleId: number) {
    const permissionsId = await this.queryBuilder()
      .select("permission_id")
      .table("role_permissions")
      .where({ roleId: roleId });

    const permissions = await Promise.all(
      permissionsId.map(async (permission) => {
        const result = await this.queryBuilder()
          .select("permission")
          .table("permissions")
          .where({ id: permission.permissionId });
        return result[0].permission;
      })
    );
    return permissions;
  }

  static async update(id: number, user: User) {
    const updateUser: User = user;
    if (user.name) updateUser.name = user.name;
    if (user.email) updateUser.email = user.email;
    if (user.password)
      updateUser.password = await bcrypt.hash(user.password, 10);

    if (Object.keys(updateUser).length === 0) {
      throw new Error("No valid fields provided to update");
    }

    return await this.queryBuilder()
      .update(updateUser)
      .table("users")
      .where({ id })
      .returning("*");
  }

  static async delete(id: number) {
    return await this.queryBuilder()
      .delete()
      .from("users")
      .where({ id })
      .returning("*");
  }
}
