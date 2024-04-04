import Address from "../../@shared/domain/value-object/address.value-object";

export interface AddClientFacadeInputDTO {
  id?: string;
  name: string;
  email: string;
  document: string;
  address: Address;
}

export interface FindClientFacadeInputDTO {
  id: string;
}

export interface FindClientFacadeOutputDTO {
  id: string;
  name: string;
  email: string;
  document: string;
  address: Address;
  updatedAt: Date;
  createdAt: Date;
}

export default interface ClientAdmFacadeInterface {
  add(input: AddClientFacadeInputDTO): Promise<void>;
  find(input: FindClientFacadeInputDTO): Promise<FindClientFacadeOutputDTO>;
}
