import { Router } from "express";
import Adoption from "../models/Adoption.model.js";
const router = Router();

router.get("/", async (_req, res) => {
  const items = await Adoption.find().lean();
  res.json(items);
});

router.get("/:id", async (req, res) => {
  const it = await Adoption.findById(req.params.id).lean();
  if (!it) return res.status(404).json({ error: "Not found" });
  res.json(it);
});

router.post("/", async (req, res) => {
  const { petId, userId, status } = req.body || {};
  if (!petId || !userId) return res.status(400).json({ error: "petId/userId requeridos" });
  const created = await Adoption.create({ petId, userId, status: status || "pending" });
  res.status(201).json(created.toObject());
});

router.put("/:id", async (req, res) => {
  const updated = await Adoption.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated.toObject());
});

router.delete("/:id", async (req, res) => {
  const del = await Adoption.findByIdAndDelete(req.params.id);
  if (!del) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

export default router;
