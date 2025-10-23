import { Router } from "express";
import User from "../models/User.model.js";
const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Listar usuarios (para verificar inserciones)
 *     tags: [Users]
 *     responses:
 *       200: { description: OK }
 *
 * /users/{uid}:
 *   get:
 *     summary: Obtener usuario por id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: No encontrado }
 */
router.get("/", async (_req, res) => {
  const users = await User.find().lean();
  res.json(users);
});

router.get("/:uid", async (req, res) => {
  const u = await User.findById(req.params.uid).lean();
  if (!u) return res.status(404).json({ error: "Not found" });
  res.json(u);
});

export default router;
