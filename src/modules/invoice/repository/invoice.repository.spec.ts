import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import InvoiceItem from "../domain/invoice-item.entity";
import Address from "../../@shared/domain/value-object/address.value-object";

describe("InvoiceRepository test", () => {
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

  it("should create a invoice", async () => {
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

    const invoiceRepository = new InvoiceRepository();
    await invoiceRepository.add(invoice);

    const invoiceDb = (
      await InvoiceModel.findOne({
        where: { id: invoice.id.id },
        include: [{ model: InvoiceItemModel }],
      })
    ).dataValues;

    expect(invoiceDb.id).toEqual(invoice.id.id);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.document).toEqual(invoice.document);
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

  it("should find a invoice by id", async () => {
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

    const invoiceRepository = new InvoiceRepository();
    await invoiceRepository.add(invoice);

    const invoiceFound = await invoiceRepository.find(invoice.id.id);

    expect(invoiceFound.id).toEqual(invoice.id);
    expect(invoiceFound.name).toEqual(invoice.name);
    expect(invoiceFound.document).toEqual(invoice.document);
    expect(invoiceFound.address).toEqual(invoice.address);
    expect(invoiceFound.items).toHaveLength(2);
    expect(invoiceFound.items[0].name).toEqual(invoice.items[0].name);
    expect(invoiceFound.items[0].price).toEqual(invoice.items[0].price);
    expect(invoiceFound.items[1].name).toEqual(invoice.items[1].name);
    expect(invoiceFound.items[1].price).toEqual(invoice.items[1].price);
    expect(invoiceFound.address).toEqual(invoice.address);
  });
});
