import express from "express";
import ProductAdmFacadeFactory from "../../../factory/facade.factory";

export const productRoute = express.Router();

productRoute.post("/", async (req, res) => {
  const productAdmFacade = ProductAdmFacadeFactory.create();

  try {
    const productDTO = {
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };

    const output = await productAdmFacade.addProduct(productDTO);
    res.status(201).send(output);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send(err);
    }
  }
});
