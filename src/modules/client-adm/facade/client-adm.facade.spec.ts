import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientAdmFacadeFactory from "../factory/facade.factory";
import Address from "../../@shared/domain/value-object/address.value-object";

describe("ClientAdmFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const clientFacade = ClientAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "Client 1",
      email: "client1@email.com",
      document: "00.000.00-00",
      address: new Address({
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
      }),
    };

    await clientFacade.add(input);

    const client = (await ClientModel.findOne({ where: { id: input.id } }))
      .dataValues;

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe(input.document);
    expect(client.street).toBe(input.address.street);
    expect(client.number).toBe(input.address.number);
    expect(client.complement).toBe(input.address.complement);
    expect(client.city).toBe(input.address.city);
    expect(client.state).toBe(input.address.state);
  });

  it("should find a client", async () => {
    const clientFacade = ClientAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "Client 1",
      email: "client1@email.com",
      document: "00.000.00-00",
      address: new Address({
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
      }),
    };

    await clientFacade.add(input);

    const client = await clientFacade.find({ id: "1" });

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe(input.document);
    expect(client.address).toEqual(input.address);
  });
});
