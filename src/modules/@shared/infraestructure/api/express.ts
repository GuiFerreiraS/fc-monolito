import express, { Express } from "express";
import { ModelCtor, Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../migrator/migrator";

export const app: Express = express();
app.use(express.json());

export async function setupDb(models: ModelCtor[], migration?: Umzug<any>) {
  let sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });

  migration = migrator(sequelize);

  await sequelize.addModels(models);

  if (migration) {
    await migration.up();
  } else {
    await sequelize.sync();
  }
  return sequelize;
}
