import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import { OrderModel } from "./order.model";
import { ClientModel } from "./client.model";
import { ProductModel } from "./product.model";
import Product from "../domain/product.entity";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import OrderRepository from "./order.repository";
import { OrderProductModel } from "./orderProduct.model";

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
      ProductModel.create({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
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
  await ClientModel.create({
    id: client.id.id,
    name: client.name,
    email: client.email,
    ...address,
  });

  return client;
};

describe("OrderRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      OrderModel,
      ClientModel,
      ProductModel,
      OrderProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a order", async () => {
    const products = await createProducts();
    const client = await createClient();

    const order = new Order({
      id: new Id(),
      client: client,
      products: products,
    });

    const orderRepository = new OrderRepository();
    await orderRepository.addOrder(order);

    const orderDb = await OrderModel.findOne({
      where: { id: order.id.id },
      include: [{ model: ClientModel }, { model: ProductModel }],
    });

    expect(orderDb.id).toEqual(order.id.id);
    expect(orderDb.status).toEqual(order.status);
    expect(orderDb.client.id).toEqual(client.id.id);
    expect(orderDb.client.name).toEqual(client.name);
    expect(orderDb.client.email).toEqual(client.email);
    expect(orderDb.products.length).toEqual(2);
    expect(orderDb.products[0].id).toEqual(products[0].id.id);
    expect(orderDb.products[0].name).toEqual(products[0].name);
    expect(orderDb.products[0].description).toEqual(products[0].description);
    expect(orderDb.products[0].salesPrice).toEqual(products[0].salesPrice);
    expect(orderDb.products[1].id).toEqual(products[1].id.id);
    expect(orderDb.products[1].name).toEqual(products[1].name);
    expect(orderDb.products[1].description).toEqual(products[1].description);
    expect(orderDb.products[1].salesPrice).toEqual(products[1].salesPrice);
  });

  it("should find a order by id", async () => {
    const products = await createProducts();
    const client = await createClient();

    const order = new Order({
      id: new Id(),
      client: client,
      products: products,
    });

    const orderRepository = new OrderRepository();
    await orderRepository.addOrder(order);

    const orderFound = await orderRepository.findOrder(order.id.id);

    expect(orderFound.id).toEqual(order.id);
    expect(orderFound.status).toEqual(order.status);
    expect(orderFound.client.id).toEqual(client.id);
    expect(orderFound.client.name).toEqual(client.name);
    expect(orderFound.client.email).toEqual(client.email);
    expect(orderFound.products.length).toEqual(2);
    expect(orderFound.products[0].id).toEqual(products[0].id);
    expect(orderFound.products[0].name).toEqual(products[0].name);
    expect(orderFound.products[0].salesPrice).toEqual(products[0].salesPrice);
    expect(orderFound.products[1].id).toEqual(products[1].id);
    expect(orderFound.products[1].name).toEqual(products[1].name);
    expect(orderFound.products[1].salesPrice).toEqual(products[1].salesPrice);
  });
});
