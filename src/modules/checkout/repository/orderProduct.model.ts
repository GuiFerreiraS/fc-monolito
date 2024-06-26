import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { OrderModel } from "./order.model";
import { ProductModel } from "./product.model";

@Table({
  tableName: "orderProduct",
  timestamps: false,
})
export class OrderProductModel extends Model {
  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false })
  declare orderId: string;

  @ForeignKey(() => ProductModel)
  @Column({ allowNull: false })
  declare productId: string;
}
