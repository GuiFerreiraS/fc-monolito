import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address.value-object";

const addressProps = {
  street: "Rua 123",
  number: "99",
  complement: "Casa Verde",
  city: "Criciúma",
  state: "SC",
  zipCode: "88888-888",
};

describe("ClientRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const client = new Client({
      id: new Id("1"),
      name: "John Doe",
      email: "john.doe@email.com",
      document: "1234-5678",
      address: new Address(addressProps),
    });
    const repository = new ClientRepository();

    await repository.add(client);

    const clientDb = (await ClientModel.findOne({ where: { id: "1" } }))
      ?.dataValues;

    expect(clientDb.id).toBe(client.id.id);
    expect(clientDb.name).toBe(client.name);
    expect(clientDb.email).toBe(client.email);
    expect(clientDb.document).toBe(client.document);
    expect(clientDb.street).toBe(client.address.street);
    expect(clientDb.number).toBe(client.address.number);
    expect(clientDb.complement).toBe(client.address.complement);
    expect(clientDb.city).toBe(client.address.city);
    expect(clientDb.state).toBe(client.address.state);
    expect(clientDb.zipCode).toBe(client.address.zipCode);
    expect(clientDb.createdAt).toEqual(client.createdAt);
    expect(clientDb.updatedAt).toEqual(client.updatedAt);
  });

  it("should find a client", async () => {
    const client = (
      await ClientModel.create({
        id: "1",
        name: "John Doe",
        email: "john.doe@email.com",
        document: "1234-5678",
        createdAt: new Date(),
        updatedAt: new Date(),
        ...addressProps,
      })
    )?.dataValues;

    const repository = new ClientRepository();

    const result = await repository.find("1");
    expect(result.id.id).toBe("1");
    expect(result.name).toBe("John Doe");
    expect(result.email).toBe("john.doe@email.com");
    expect(result.address.city).toBe(addressProps.city);
    expect(result.address.state).toBe(addressProps.state);
    expect(result.address.zipCode).toBe(addressProps.zipCode);
    expect(result.address.street).toBe(addressProps.street);
    expect(result.address.number).toBe(addressProps.number);
    expect(result.address.complement).toBe(addressProps.complement);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  });
});
