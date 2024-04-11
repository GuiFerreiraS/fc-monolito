import UseCaseInterface from "../../@shared/domain/usecase/usecase.interface";
import ProductAdmFacadeInterface, {
  AddProductFacadeInputDTO,
  AddProductFacadeOutputDTO,
  CheckStockFacadeInputDTO,
  CheckStockFacadeOutputDTO,
} from "./product-adm.facade.interface";

export interface UseCasesProps {
  addUseCase: UseCaseInterface;
  stockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  private _addUseCase: any;
  private _checkStockUseCase: any;

  constructor(useCasesProps: UseCasesProps) {
    this._addUseCase = useCasesProps.addUseCase;
    this._checkStockUseCase = useCasesProps.stockUseCase;
  }

  addProduct(
    input: AddProductFacadeInputDTO
  ): Promise<AddProductFacadeOutputDTO> {
    return this._addUseCase.execute(input);
  }

  checkStock(
    input: CheckStockFacadeInputDTO
  ): Promise<CheckStockFacadeOutputDTO> {
    return this._checkStockUseCase.execute(input);
  }
}
