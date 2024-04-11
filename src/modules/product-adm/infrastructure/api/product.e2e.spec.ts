import request from "supertest";
import { app, setupDb } from "../../../@shared/infraestructure/api/express";
import { ProductModel } from "../../repository/product.model";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../../@shared/infraestructure/migrator/migrator";
import { productRoute } from "./routes/product.route";

app.use("/products", productRoute);

describe("E2E test for products", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = await setupDb([ProductModel], migration);
  });

  afterAll(async () => {
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app).post("/products").send({
      name: "Product",
      description: "Product description",
      purchasePrice: 100,
      stock: 10,
    });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Product");
    expect(response.body.description).toBe("Product description");
    expect(response.body.purchasePrice).toBe(100);
    expect(response.body.stock).toBe(10);
  });
});
