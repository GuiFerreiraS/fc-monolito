import ClientAdmFacadeFactory from "../../client-adm/factory/facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutFacade from "../facade/checkout.facade";
import OrderRepository from "../repository/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutFacadeFactory {
  static create() {
    const clientFacade = ClientAdmFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();
    const repository = new OrderRepository();

    const placeOrderUseCase = new PlaceOrderUseCase(
      clientFacade,
      productFacade,
      catalogFacade,
      invoiceFacade,
      paymentFacade,
      repository
    );
    const clientAdmFacade = new CheckoutFacade({
      placeOrderUseCase: placeOrderUseCase,
    });

    return clientAdmFacade;
  }
}
