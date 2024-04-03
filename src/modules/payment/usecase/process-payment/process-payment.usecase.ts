import UseCaseInterface from "../../../@shared/domain/usecase/usecase.interface";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import PaymentGateway from "../../gateway/payment.gateway";
import {
  ProcessPaymentInputDTO,
  ProcessPaymentOutputDTO,
} from "./process-payment.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface {
  constructor(private transactionRepository: PaymentGateway) {}

  async execute(
    input: ProcessPaymentInputDTO
  ): Promise<ProcessPaymentOutputDTO> {
    const transaction = new Transaction({
      id: new Id(input.orderId),
      amount: input.amount,
      orderId: input.orderId,
    });

    transaction.process();

    const persistTransaction = await this.transactionRepository.save(
      transaction
    );

    return {
      transactionId: persistTransaction.id.id,
      orderId: persistTransaction.orderId,
      amount: persistTransaction.amount,
      status: persistTransaction.status,
      createdAt: persistTransaction.createdAt,
      updatedAt: persistTransaction.updatedAt,
    };
  }
}
