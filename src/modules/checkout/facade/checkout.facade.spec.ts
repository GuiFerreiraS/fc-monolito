import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address.value-object";
import { OrderModel } from "../repository/order.model";
import { ProductModel } from "../repository/product.model";
import { ProductModel as ProductAdmModel } from "../../product-adm/repository/product.model";
import { ProductModel as ProductCatalogModel } from "../../store-catalog/repository/product.model";
import { OrderProductModel } from "../repository/orderProduct.model";
import { ClientModel } from "../repository/client.model";
import { ClientModel as ClientAdmModel } from "../../client-adm/repository/client.model";
import CheckoutFacadeFactory from "../factory/facade.factory";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import { migrator } from "../../@shared/infraestructure/migrator/migrator";
import { Umzug } from "umzug";
import { TransactionModel } from "../../payment/repository/transaction.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import InvoiceItemModel from "../../invoice/repository/invoice-item.model";

const createProducts = async () => {
  const products = [
    new Product({
      id: new Id("p1"),
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
    }),
    new Product({
      id: new Id("p2"),
      name: "Product 2",
      description: "Product 2 description",
      salesPrice: 200,
    }),
  ];

  await Promise.all(
    products.map((product) =>
      ProductAdmModel.create({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
        purchasePrice: product.salesPrice * 1.3,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    )
  );
  return products;
};

const createClient = async () => {
  const address = {
    street: "Street",
    number: "250",
    complement: "Casa",
    city: "City",
    state: "State",
    zipCode: "ZipCode",
  };
  const client = new Client({
    id: new Id("p1"),
    name: "Product 1",
    email: "Product 1 description",
    address: `${address.street}, ${address.number}, ${address.complement}, ${address.city}, ${address.state}, ${address.zipCode}}`,
  });
  await ClientAdmModel.create({
    id: client.id.id,
    name: client.name,
    email: client.email,
    document: "000.000.000-00",
    ...address,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return client;
};

describe("CheckoutFacade test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([
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
    ]);

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should place a order", async () => {
    const products = await createProducts();
    const client = await createClient();

    const checkoutFacade = CheckoutFacadeFactory.create();

    const input = {
      clientId: client.id.id,
      products: products.map((product) => ({
        productId: product.id.id,
      })),
    };

    const output = await checkoutFacade.placeOrder(input);

    expect(output.id).toBeDefined();
    expect(output.total).toBe(300);
    expect(output.products).toEqual(input.products);
    expect(output.invoiceId).toBeDefined();
    expect(output.status).toBe("approved");
  });
});
