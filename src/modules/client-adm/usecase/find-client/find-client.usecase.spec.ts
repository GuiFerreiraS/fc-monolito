import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
  id: new Id("1"),
  name: "John Doe",
  email: "john.doe@example.com",
  address: "123 Main Street, Anytown, CA 12345",
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
    expect(result.address).toBe(client.address);
  });
});
