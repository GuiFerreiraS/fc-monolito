import { SequelizeStorage, Umzug } from "umzug";
import { Sequelize } from "sequelize";

export const migrator = (sequelize: Sequelize) => {
  return new Umzug({
    migrations: {
      glob: "src/modules/@shared/infraestructure/migrator/migrations/*.{js,ts}",
    },
    context: sequelize,
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });
};
