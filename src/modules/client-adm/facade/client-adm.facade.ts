import UseCaseInterface from "../../@shared/domain/usecase/usecase.interface";
import ClientAdmFacadeInterface, {
  AddClientFacadeInputDTO,
  AddClientFacadeOutputDTO,
  FindClientFacadeInputDTO,
  FindClientFacadeOutputDTO,
} from "./client-adm.facade.interface";

export interface UseCasesProps {
  addUseCase: UseCaseInterface;
  findUseCase: UseCaseInterface;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _findUseCase: any;
  private _addUseCase: any;

  constructor(useCasesProps: UseCasesProps) {
    this._addUseCase = useCasesProps.addUseCase;
    this._findUseCase = useCasesProps.findUseCase;
  }

  async add(input: AddClientFacadeInputDTO): Promise<AddClientFacadeOutputDTO> {
    return this._addUseCase.execute(input);
  }

  find(input: FindClientFacadeInputDTO): Promise<FindClientFacadeOutputDTO> {
    return this._findUseCase.execute(input);
  }
}
