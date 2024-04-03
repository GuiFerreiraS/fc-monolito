import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const addressProps = {
  city: "city",
  state: "state",
  complement: "complement",
  number: "100",
  street: "street",
  zipCode: "zipCode",
};

const invoice = new Invoice({
  id: new Id(),
  name: "Invoice",
  document: "Invoice document",
  address: new Address(addressProps),
  items: [
    new InvoiceItem({ name: "Item 1", price: 100 }),
    new InvoiceItem({ name: "Item 2", price: 200 }),
  ],
});

const MockRepository = () => {
  return {
    add: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    find: jest.fn(),
  };
};

describe("GenerateInvoice use case unit test", () => {
  it("should generate a invoice", async () => {
    const InvoiceRepository = MockRepository();
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(
      InvoiceRepository
    );
    const input = {
      name: "Invoice",
      document: "Invoice document",
      ...addressProps,
      items: [
        { id: invoice.items[0].id.id, name: "Item 1", price: 100 },
        { id: invoice.items[1].id.id, name: "Item 2", price: 200 },
      ],
    };

    const result = await generateInvoiceUseCase.execute(input);

    expect(InvoiceRepository.add).toHaveBeenCalled();
    expect(result.id).toEqual(invoice.id.id);
    expect(result.document).toEqual("Invoice document");
    expect(result.city).toEqual("city");
    expect(result.state).toEqual("state");
    expect(result.complement).toEqual("complement");
    expect(result.number).toEqual("100");
    expect(result.street).toEqual("street");
    expect(result.zipCode).toEqual("zipCode");
    expect(result.items.length).toEqual(2);
    expect(result.total).toBe(300);
    expect(result.items[0].name).toEqual("Item 1");
    expect(result.items[0].price).toEqual(100);
    expect(result.items[1].name).toEqual("Item 2");
    expect(result.items[1].price).toEqual(200);
  });
});
