import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import { TransactionModel } from "./transaction.model";
import TransactionRepository from "./transaction.repository";
import Transaction from "../domain/transaction";

describe("TransactionRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should save a transaction", async () => {
    const transaction = new Transaction({
      id: new Id("1"),
      amount: 100,
      orderId: "1",
    });
    transaction.approve();
    const transactionRepository = new TransactionRepository();
    await transactionRepository.save(transaction);

    const result = (
      await TransactionModel.findOne({
        where: { id: transaction.id.id },
      })
    ).dataValues;

    expect(result.id).toEqual(transaction.id.id);
    expect(result.amount).toEqual(transaction.amount);
    expect(result.orderId).toEqual(transaction.orderId);
    expect(result.status).toEqual("approved");
  });
});
