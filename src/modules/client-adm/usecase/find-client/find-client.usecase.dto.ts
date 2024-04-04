import Address from "../../../@shared/domain/value-object/address.value-object";

export interface FindClientInputDTO {
  id: string;
}

export interface FindClientOutputDTO {
  id: string;
  name: string;
  email: string;
  document: string;
  address: Address;
  updatedAt: Date;
  createdAt: Date;
}
