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
      address: "123 Main Street",
    };
    const result = await useCase.execute(input);

    expect(repository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
    expect(result.address).toBe(input.address);
  });
});
