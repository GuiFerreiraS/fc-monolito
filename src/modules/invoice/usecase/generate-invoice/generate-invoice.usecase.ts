import Address from "../../../@shared/domain/value-object/address.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDTO,
  GenerateInvoiceUseCaseOutputDTO,
} from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository;
  }

  async execute(
    input: GenerateInvoiceUseCaseInputDTO
  ): Promise<GenerateInvoiceUseCaseOutputDTO> {
    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address: new Address({
        street: input.street,
        number: input.number,
        complement: input.complement,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode,
      }),
      items: input.items.map(
        (item) =>
          new InvoiceItem({
            name: item.name,
            price: item.price,
          })
      ),
    });
    const result = await this._invoiceRepository.add(invoice);

    return {
      id: result.id.id,
      name: result.name,
      document: result.document,
      street: result.address.street,
      number: result.address.number,
      complement: result.address.complement,
      city: result.address.city,
      state: result.address.state,
      zipCode: result.address.zipCode,
      items: result.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: result.total,
    };
  }
}
