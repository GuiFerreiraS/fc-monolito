import UseCaseInterface from "../../@shared/domain/usecase/usecase.interface";
import PaymentFacadeInterface, {
  PaymentFacadeInputDTO,
  PaymentFacadeOutputDTO,
} from "./payment.facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {
  constructor(private processPaymentUseCase: UseCaseInterface) {}

  process(input: PaymentFacadeInputDTO): Promise<PaymentFacadeOutputDTO> {
    return this.processPaymentUseCase.execute(input);
  }
}
