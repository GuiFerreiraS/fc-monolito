import ProcessPaymentUseCase from "./process-payment.usecase";

const MockRepository = () => ({
  save: jest
    .fn()
    .mockImplementation((transaction) => Promise.resolve(transaction)),
});

describe("Process payment use case unit test", () => {
  it("should approve a transaction", async () => {
    const paymentRepository = MockRepository();
    const useCase = new ProcessPaymentUseCase(paymentRepository);
    const input = {
      id: "1",
      orderId: "1",
      amount: 100,
    };

    const result = await useCase.execute(input);

    expect(result.transactionId).toBe(input.id);
    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(input.amount);
    expect(result.orderId).toBe(input.orderId);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it("should decline a transaction", async () => {
    const paymentRepository = MockRepository();
    const useCase = new ProcessPaymentUseCase(paymentRepository);
    const input = {
      id: "1",
      orderId: "1",
      amount: 99,
    };

    const result = await useCase.execute(input);

    expect(result.transactionId).toBe(input.id);
    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.status).toBe("declined");
    expect(result.amount).toBe(input.amount);
    expect(result.orderId).toBe(input.orderId);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });
});
