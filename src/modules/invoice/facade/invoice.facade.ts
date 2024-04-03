import UseCaseInterface from "../../@shared/domain/usecase/usecase.interface";
import InvoiceFacadeInterface, {
  GenerateInvoiceFacadeInputDTO,
  GenerateInvoiceFacadeOutputDTO,
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
} from "./invoice.facade.interface";

export interface UseCasesProps {
  generateUseCase: UseCaseInterface;
  findUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _findUseCase: any;
  private _generateUseCase: any;

  constructor(useCasesProps: UseCasesProps) {
    this._generateUseCase = useCasesProps.generateUseCase;
    this._findUseCase = useCasesProps.findUseCase;
  }

  generate(
    input: GenerateInvoiceFacadeInputDTO
  ): Promise<GenerateInvoiceFacadeOutputDTO> {
    return this._generateUseCase.execute(input);
  }

  find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
    return this._findUseCase.execute(input);
  }
}
