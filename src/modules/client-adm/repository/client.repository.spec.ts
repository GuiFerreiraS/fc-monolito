import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

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
      address: "Address",
    });
    const repository = new ClientRepository();

    await repository.add(client);

    const clientDb = (await ClientModel.findOne({ where: { id: "1" } }))
      ?.dataValues;

    expect(clientDb.id).toBe(client.id.id);
    expect(clientDb.name).toBe(client.name);
    expect(clientDb.email).toBe(client.email);
    expect(clientDb.address).toBe(client.address);
    expect(clientDb.createdAt).toEqual(client.createdAt);
    expect(clientDb.updatedAt).toEqual(client.updatedAt);
  });

  it("should find a client", async () => {
    const client = (
      await ClientModel.create({
        id: "1",
        name: "John Doe",
        email: "john.doe@email.com",
        address: "Address",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    )?.dataValues;

    const repository = new ClientRepository();

    const result = await repository.find("1");
    expect(result.id.id).toBe("1");
    expect(result.name).toBe("John Doe");
    expect(result.email).toBe("john.doe@email.com");
    expect(result.address).toBe("Address");
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  });
});