import UseCaseInterface from "../../@shared/domain/usecase/usecase.interface";
import CheckoutFacadeInterface, {
  PlaceOrderFacadeInputDTO,
  PlaceOrderFacadeOutputDTO,
} from "./checkout.facade.interface";

export interface UseCasesProps {
  placeOrderUseCase: UseCaseInterface;
}

export default class CheckoutFacade implements CheckoutFacadeInterface {
  private _placeOrderUseCase: any;

  constructor(useCasesProps: UseCasesProps) {
    this._placeOrderUseCase = useCasesProps.placeOrderUseCase;
  }

  placeOrder(
    input: PlaceOrderFacadeInputDTO
  ): Promise<PlaceOrderFacadeOutputDTO> {
    return this._placeOrderUseCase.execute(input);
  }
}
