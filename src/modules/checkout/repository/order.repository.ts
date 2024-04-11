import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { ClientModel } from "./client.model";
import { OrderModel } from "./order.model";
import { OrderProductModel } from "./orderProduct.model";
import { ProductModel } from "./product.model";

export default class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await OrderModel.create({
      id: order.id.id,
      clientId: order.client.id.id,
      status: order.status,
      invoiceId: order.invoiceId,
    });

    await Promise.all(
      order.products.map((product) =>
        OrderProductModel.create({
          orderId: order.id.id,
          productId: product.id.id,
        })
      )
    );
  }

  async findOrder(id: string): Promise<Order | null> {
    const order = await OrderModel.findOne({
      where: { id },
      include: [{ model: ClientModel }, { model: ProductModel }],
    });

    if (!order) {
      return null;
    }

    return new Order({
      id: new Id(order.id),
      client: new Client({
        id: new Id(order.client.id),
        name: order.client.name,
        email: order.client.email,
        address: `${order.client.street}, ${order.client.number}, ${order.client.complement}, ${order.client.city}, ${order.client.state}, ${order.client.zipCode}}`,
      }),
      products: order.products.map(
        (product) =>
          new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
          })
      ),
      status: order.status,
      invoiceId: order.invoiceId,
    });
  }
}
