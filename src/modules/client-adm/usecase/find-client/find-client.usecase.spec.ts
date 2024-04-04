import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const address = new Address({
  street: "Rua 123",
  number: "99",
  complement: "Casa Verde",
  city: "Criciúma",
  state: "SC",
  zipCode: "88888-888",
});

const client = new Client({
  id: new Id("1"),
  name: "John Doe",
  email: "john.doe@example.com",
  document: "000.000.000-00",
  address,
});

const MockRepository = () => ({
  add: jest.fn(),
  find: jest.fn().mockReturnValue(Promise.resolve(client)),
});

describe("Find client use case unit test", () => {
  it("should find a client", async () => {
    const repository = MockRepository();
    const useCase = new FindClientUseCase(repository);
    const input = {
      id: "1",
    };
    const result = await useCase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBe(client.id.id);
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(result.address).toEqual(client.address);
  });
});
