import Address from "../../../@shared/domain/value-object/address.value-object";
import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => ({
  add: jest.fn(),
  find: jest.fn(),
});

describe("Add client use case unit test", () => {
  it("should add a client", async () => {
    const repository = MockRepository();
    const useCase = new AddClientUseCase(repository);
    const input = {
      name: "Client 1",
      email: "client1@example.com",
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
    const result = await useCase.execute(input);

    expect(repository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
    expect(result.document).toBe(input.document);
    expect(result.address).toEqual(input.address);
  });
});
