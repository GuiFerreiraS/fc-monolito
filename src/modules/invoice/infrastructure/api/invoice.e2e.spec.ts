import request from "supertest";
import { app, setupDb } from "../../../@shared/infraestructure/api/express";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../../@shared/infraestructure/migrator/migrator";

import { clientRoute } from "../../../client-adm/infrastructure/api/routes/client.route";
import { productRoute } from "../../../product-adm/infrastructure/api/routes/product.route";
import { checkoutRoute } from "../../../checkout/infrastructure/api/routes/checkout.route";
import { invoiceRoute } from "./routes/invoice.route";

import { OrderModel } from "../../../checkout/repository/order.model";
import { ProductModel } from "../../../checkout/repository/product.model";
import { ProductModel as ProductAdmModel } from "../../../product-adm/repository/product.model";
import { ProductModel as ProductCatalogModel } from "../../../store-catalog/repository/product.model";
import { OrderProductModel } from "../../../checkout/repository/orderProduct.model";
import { ClientModel } from "../../../checkout/repository/client.model";
import { ClientModel as ClientAdmModel } from "../../../client-adm/repository/client.model";
import { TransactionModel } from "../../../payment/repository/transaction.model";
import InvoiceModel from "../../repository/invoice.model";
import InvoiceItemModel from "../../repository/invoice-item.model";

app.use("/clients", clientRoute);
app.use("/products", productRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

describe("E2E test for invoice", () => {
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

  it("should get a invoice by id", async () => {
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

    const orderResponse = await request(app)
      .post("/checkout")
      .send(checkoutPayload);

    expect(orderResponse.status).toBe(201);

    const invoiceResponse = await request(app).get(
      `/invoice/${orderResponse.body.invoiceId}`
    );

    expect(invoiceResponse.status).toBe(201);
    expect(invoiceResponse.body.name).toBe("Client");
    expect(invoiceResponse.body.document).toBe("000.000.000-00");
    expect(invoiceResponse.body.address.street).toBe("Street 1");
    expect(invoiceResponse.body.address.number).toBe("123");
    expect(invoiceResponse.body.address.complement).toBe("Complement 1");
    expect(invoiceResponse.body.address.city).toBe("City 1");
    expect(invoiceResponse.body.address.state).toBe("State 1");
    expect(invoiceResponse.body.address.zipCode).toBe("12345-678");
    expect(invoiceResponse.body.items.length).toBe(2);
    expect(invoiceResponse.body.items[0].price).toBe(130);
    expect(invoiceResponse.body.items[1].price).toBe(260);
    expect(invoiceResponse.body.total).toBe(390);
  });
});
