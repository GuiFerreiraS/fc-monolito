import { Sequelize } from "sequelize-typescript";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceModel from "../repository/invoice.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate a invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const addressProps = {
      city: "city",
      state: "state",
      complement: "complement",
      number: "100",
      street: "street",
      zipCode: "zipCode",
    };

    const input = {
      name: "Invoice",
      document: "Invoice document",
      ...addressProps,
      items: [
        { id: new Id().id, name: "Item 1", price: 100 },
        { id: new Id().id, name: "Item 2", price: 200 },
      ],
    };

    const invoiceResult = await invoiceFacade.generate(input);

    const invoiceDb = (
      await InvoiceModel.findOne({
        where: { id: invoiceResult.id },
        include: [{ model: InvoiceItemModel }],
      })
    ).dataValues;

    expect(invoiceDb.id).toEqual(invoiceResult.id);
    expect(invoiceDb.name).toEqual(input.name);
    expect(invoiceDb.document).toEqual(input.document);
    expect(invoiceDb.city).toEqual(addressProps.city);
    expect(invoiceDb.state).toEqual(addressProps.state);
    expect(invoiceDb.complement).toEqual(addressProps.complement);
    expect(invoiceDb.number).toEqual(addressProps.number);
    expect(invoiceDb.street).toEqual(addressProps.street);
    expect(invoiceDb.zipCode).toEqual(addressProps.zipCode);
    expect(invoiceDb.items.length).toEqual(2);
    expect(invoiceDb.items[0].name).toEqual("Item 1");
    expect(invoiceDb.items[0].price).toEqual(100);
    expect(invoiceDb.items[1].name).toEqual("Item 2");
    expect(invoiceDb.items[1].price).toEqual(200);
  });

  it("should find a invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();
    const addressProps = {
      city: "city",
      state: "state",
      complement: "complement",
      number: "100",
      street: "street",
      zipCode: "zipCode",
    };

    const input = {
      name: "Invoice",
      document: "Invoice document",
      ...addressProps,
      items: [
        { id: new Id().id, name: "Item 1", price: 100 },
        { id: new Id().id, name: "Item 2", price: 200 },
      ],
    };

    const invoiceResult = await invoiceFacade.generate(input);

    const invoice = await invoiceFacade.find({ id: invoiceResult.id });

    expect(invoice.id).toEqual(invoiceResult.id);
    expect(invoice.name).toEqual(input.name);
    expect(invoice.document).toEqual(input.document);
    expect(invoice.address.city).toEqual(addressProps.city);
    expect(invoice.address.state).toEqual(addressProps.state);
    expect(invoice.address.complement).toEqual(addressProps.complement);
    expect(invoice.address.number).toEqual(addressProps.number);
    expect(invoice.address.street).toEqual(addressProps.street);
    expect(invoice.address.zipCode).toEqual(addressProps.zipCode);
    expect(invoice.items.length).toEqual(2);
    expect(invoice.items[0].name).toEqual("Item 1");
    expect(invoice.items[0].price).toEqual(100);
    expect(invoice.items[1].name).toEqual("Item 2");
    expect(invoice.items[1].price).toEqual(200);
  });
});
