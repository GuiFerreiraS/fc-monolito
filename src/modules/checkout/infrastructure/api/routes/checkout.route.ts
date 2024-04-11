import express from "express";
import CheckoutFacadeFactory from "../../../factory/facade.factory";
import Address from "../../../../@shared/domain/value-object/address.value-object";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req, res) => {
  const checkoutAdmFacade = CheckoutFacadeFactory.create();

  try {
    const checkoutDTO = {
      clientId: req.body.clientId,
      products: req.body.products,
    };

    const output = await checkoutAdmFacade.placeOrder(checkoutDTO);
    res.status(201).send(output);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send(err);
    }
  }
});
