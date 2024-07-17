import bcrypt from "bcrypt";
import { permissions } from "./../constant/Permission";
import { getUserByEmail } from "./user";
import { User } from "../interface/user";
import { BaseModel } from "./BaseModel";
import { Todo } from "../interface/task";

export class TaskModel extends BaseModel {
  static async create(todo: Todo, id: number) {
    const todoToCreate = {
      title: todo.title,
      isCompleted: false,
      userId: id,
    };
    return await this.queryBuilder()
      .insert(todoToCreate)
      .table("tasks")
      .returning("*");
  }

  static async getById(id: number) {
    console.log("userId", id);
    const result = await this.queryBuilder()
      .select("*")
      .from("tasks")
      .where("user_id", id);
    return result;
  }

  static async findById(id: number, userId: number) {
    const result = await this.queryBuilder()
      .select("*")
      .from("tasks")
      .where("id", id)
      .andWhere("userId", userId);
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

  static async update(id: number, todo: Todo, userId: number) {
    let updatedTodo: Todo = todo;
    console.log("updatedTodo", updatedTodo);

    if (todo.title) updatedTodo.title = todo.title;
    if (todo.isCompleted) updatedTodo.isCompleted = todo.isCompleted;
    return await this.queryBuilder()
      .update(updatedTodo)
      .table("tasks")
      .where({ id, userId })
      .returning("*");
  }

  static async delete(id: number) {
    return await this.queryBuilder().delete().from("tasks").where({ id });
  }
}
