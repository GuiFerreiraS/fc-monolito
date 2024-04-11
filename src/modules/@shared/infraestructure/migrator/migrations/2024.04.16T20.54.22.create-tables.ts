import { DataTypes, Sequelize } from "sequelize";
import { MigrationFn } from "umzug";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("products", {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    purchasePrice: {
      type: DataTypes.NUMBER(),
      allowNull: true,
    },
    salesPrice: {
      type: DataTypes.NUMBER(),
      allowNull: true,
    },
    stock: {
      type: DataTypes.NUMBER(),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
  });

  await sequelize.getQueryInterface().createTable("clients", {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    document: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    complement: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
  });

  await sequelize.getQueryInterface().createTable("transactions", {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    amount: {
      type: DataTypes.NUMBER(),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
  });

  await sequelize.getQueryInterface().createTable("invoices", {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    document: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    complement: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
  });

  await sequelize.getQueryInterface().createTable("invoice_items", {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    invoice_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: "invoices",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataTypes.NUMBER(),
      allowNull: false,
    },
  });

  await sequelize.getQueryInterface().createTable("orders", {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: "clients",
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    invoiceId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });

  await sequelize.getQueryInterface().createTable("orderProduct", {
    orderId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: "orders",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("orderProduct");
  await sequelize.getQueryInterface().dropTable("orders");
  await sequelize.getQueryInterface().dropTable("invoice_items");
  await sequelize.getQueryInterface().dropTable("invoices");
  await sequelize.getQueryInterface().dropTable("transactions");
  await sequelize.getQueryInterface().dropTable("clients");
  await sequelize.getQueryInterface().dropTable("products");
};
