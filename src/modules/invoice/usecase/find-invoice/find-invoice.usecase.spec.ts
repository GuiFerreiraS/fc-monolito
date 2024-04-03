import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const addressProps = {
  city: "city",
  state: "state",
  complement: "complement",
  number: "100",
  street: "street",
  zipCode: "zipCode",
};

const invoice = new Invoice({
  id: new Id("1"),
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
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("FindInvoice use case unit test", () => {
  it("should find a invoice", async () => {
    const InvoiceRepository = MockRepository();
    const findInvoiceUseCase = new FindInvoiceUseCase(InvoiceRepository);
    const input = {
      id: "1",
    };

    const result = await findInvoiceUseCase.execute(input);

    expect(InvoiceRepository.find).toHaveBeenCalled();
    expect(result.id).toEqual("1");
    expect(result.document).toEqual("Invoice document");
    expect(result.address.city).toEqual("city");
    expect(result.address.state).toEqual("state");
    expect(result.address.complement).toEqual("complement");
    expect(result.address.number).toEqual("100");
    expect(result.address.street).toEqual("street");
    expect(result.address.zipCode).toEqual("zipCode");
    expect(result.items.length).toEqual(2);
    expect(result.total).toBe(300);
    expect(result.items[0].name).toEqual("Item 1");
    expect(result.items[0].price).toEqual(100);
    expect(result.items[1].name).toEqual("Item 2");
    expect(result.items[1].price).toEqual(200);
  });
});
