import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase";
import { FindProductInputDTO } from "../usecase/find-product/find-product.dto";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import StoreCatalogFacadeInterface, {
  FindAllStoreCatalogFacadeOutputDTO,
  FindStoreCatalogFacadeInputDTO,
  FindStoreCatalogFacadeOutputDTO,
} from "./store-catalog.facade.interface";

export interface UseCaseProps {
  findUseCase: FindProductUseCase;
  findAllUseCase: FindAllProductsUseCase;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private _findUseCase: FindProductUseCase;
  private _findAllUseCase: FindAllProductsUseCase;

  constructor({ findUseCase, findAllUseCase }: UseCaseProps) {
    this._findUseCase = findUseCase;
    this._findAllUseCase = findAllUseCase;
  }

  find(
    input: FindStoreCatalogFacadeInputDTO
  ): Promise<FindStoreCatalogFacadeOutputDTO> {
    return this._findUseCase.execute(input);
  }

  findAll(): Promise<FindAllStoreCatalogFacadeOutputDTO> {
    return this._findAllUseCase.execute();
  }
}
