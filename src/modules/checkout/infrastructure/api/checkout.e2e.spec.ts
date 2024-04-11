import request from "supertest";
import { app, setupDb } from "../../../@shared/infraestructure/api/express";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../../@shared/infraestructure/migrator/migrator";

import { checkoutRoute } from "./routes/checkout.route";
import { clientRoute } from "../../../client-adm/infrastructure/api/routes/client.route";
import { productRoute } from "../../../product-adm/infrastructure/api/routes/product.route";

import { OrderModel } from "../../repository/order.model";
import { ProductModel } from "../../repository/product.model";
import { ProductModel as ProductAdmModel } from "../../../product-adm/repository/product.model";
import { ProductModel as ProductCatalogModel } from "../../../store-catalog/repository/product.model";
import { OrderProductModel } from "../../repository/orderProduct.model";
import { ClientModel } from "../../repository/client.model";
import { ClientModel as ClientAdmModel } from "../../../client-adm/repository/client.model";
import { TransactionModel } from "../../../payment/repository/transaction.model";
import InvoiceModel from "../../../invoice/repository/invoice.model";
import InvoiceItemModel from "../../../invoice/repository/invoice-item.model";

app.use("/clients", clientRoute);
app.use("/products", productRoute);
app.use("/checkout", checkoutRoute);

describe("E2E test for checkout", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = await setupDb(
      [
        OrderModel,
        ClientModel,
        ClientAdmModel,
        ProductModel,
        ProductAdmModel,
        ProductCatalogModel,
        OrderProductModel,
        TransactionModel,
        InvoiceModel,
        InvoiceItemModel,
      ],
      migration
    );
  });

  afterAll(async () => {
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should create a order", async () => {
    const clientResponse = await request(app)
      .post("/clients")
      .send({
        name: "Client",
        email: "clientemail@test.test",
        document: "000.000.000-00",
        address: {
          street: "Street 1",
          number: "123",
          complement: "Complement 1",
          city: "City 1",
          state: "State 1",
          zipCode: "12345-678",
        },
      });

    expect(clientResponse.status).toBe(201);

    const product1Response = await request(app).post("/products").send({
      name: "Product 1",
      description: "Product description 1",
      purchasePrice: 100,
      stock: 10,
    });

    expect(product1Response.status).toBe(201);

    const product2Response = await request(app).post("/products").send({
      name: "Product 2",
      description: "Product description 2",
      purchasePrice: 200,
      stock: 20,
    });

    expect(product2Response.status).toBe(201);

    const checkoutPayload = {
      clientId: clientResponse.body.id,
      products: [
        { productId: product1Response.body.id },
        { productId: product2Response.body.id },
      ],
    };

    const response = await request(app).post("/checkout").send(checkoutPayload);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.status).toBe("approved");
    expect(response.body.total).toBe(390);
    expect(response.body.products).toHaveLength(2);
  });
});
