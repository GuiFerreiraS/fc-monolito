import express from "express";
import ClientAdmFacadeFactory from "../../../factory/facade.factory";
import Address from "../../../../@shared/domain/value-object/address.value-object";

export const clientRoute = express.Router();

clientRoute.post("/", async (req, res) => {
  const clientAdmFacade = ClientAdmFacadeFactory.create();

  try {
    const clientDTO = {
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: new Address(req.body.address),
    };

    await clientAdmFacade.add(clientDTO);
    res.status(201).send();
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send(err);
    }
  }
});
