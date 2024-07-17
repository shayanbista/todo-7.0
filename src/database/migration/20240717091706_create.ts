import { Knex } from "knex";

const TABLE_NAME = "tasks";

/**
 * Create table tasks.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements();

    table.string("title").notNullable();
    table.boolean("is_completed");
    table
      .bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("cascade");

    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));

    table.timestamp("updated_at").nullable();
  });
}

/**
 * Drop table tasks.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
