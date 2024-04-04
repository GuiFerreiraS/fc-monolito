import Address from "../../../@shared/domain/value-object/address.value-object";

export interface AddClientInputDTO {
  id?: string;
  name: string;
  email: string;
  document: string;
  address: Address;
}

export interface AddClientOutputDTO {
  id: string;
  name: string;
  email: string;
  document: string;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
}
