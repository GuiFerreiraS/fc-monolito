import express from "express";
import InvoiceFacadeFactory from "../../../factory/invoice.facade.factory";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req, res) => {
  const invoiceFacade = InvoiceFacadeFactory.create();
  const id = req.params.id;

  try {
    const output = await invoiceFacade.find({ id });
    res.status(201).send(output);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send(err);
    }
  }
});
