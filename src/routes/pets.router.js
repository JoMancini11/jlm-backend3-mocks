import { Router } from "express";
import Pet from "../models/Pet.model.js";
const router = Router();

router.get("/", async (_req, res) => {
  const pets = await Pet.find().lean();
  res.json(pets);
});

export default router;
