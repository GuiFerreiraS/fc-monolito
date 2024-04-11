import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { ClientModel } from "./client.model";
import { ProductModel } from "./product.model";
import { OrderProductModel } from "./orderProduct.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => ClientModel)
  @Column({ allowNull: false })
  declare clientId: string;

  @BelongsTo(() => ClientModel)
  declare client: ClientModel;

  @BelongsToMany(() => ProductModel, () => OrderProductModel)
  declare products: ProductModel[];

  @Column({ allowNull: false })
  declare status: string;

  @Column({ allowNull: true })
  declare invoiceId: string;
}
