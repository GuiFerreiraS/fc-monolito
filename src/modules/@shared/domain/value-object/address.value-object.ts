import ValueObject from "./value-object.interface";

type AddressProps = {
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
};

export default class Address implements ValueObject {
  private _street: string;
  private _number: string;
  private _complement: string;
  private _city: string;
  private _state: string;
  private _zipCode: string;

  constructor(props: AddressProps) {
    this._city = props.city;
    this._complement = props.complement;
    this._number = props.number;
    this._state = props.state;
    this._street = props.street;
    this._zipCode = props.zipCode;
  }

  get city(): string {
    return this._city;
  }

  get complement(): string {
    return this._complement;
  }

  get number(): string {
    return this._number;
  }

  get state(): string {
    return this._state;
  }

  get street(): string {
    return this._street;
  }

  get zipCode(): string {
    return this._zipCode;
  }
}
