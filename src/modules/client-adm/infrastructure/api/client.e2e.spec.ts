import request from "supertest";
import { app, setupDb } from "../../../@shared/infraestructure/api/express";
import { ClientModel } from "../../repository/client.model";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../../@shared/infraestructure/migrator/migrator";
import { clientRoute } from "./routes/client.route";

app.use("/clients", clientRoute);

describe("E2E test for clients", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = await setupDb([ClientModel], migration);
  });

  afterAll(async () => {
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should create a client", async () => {
    const response = await request(app)
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

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Client");
    expect(response.body.email).toBe("clientemail@test.test");
    expect(response.body.document).toBe("000.000.000-00");
    expect(response.body.address.street).toBe("Street 1");
    expect(response.body.address.number).toBe("123");
    expect(response.body.address.complement).toBe("Complement 1");
    expect(response.body.address.city).toBe("City 1");
    expect(response.body.address.state).toBe("State 1");
    expect(response.body.address.zipCode).toBe("12345-678");
  });
});
