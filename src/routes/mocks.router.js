import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import Pet from "../models/Pet.model.js";
import { buildUser, buildPet, makeArray } from "../mocks/mocks.service.js";

const router = Router();

/**
 * @openapi
 * /mocks/mockingpets:
 *   get:
 *     summary: Devuelve mascotas mockeadas (NO inserta en DB)
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: count
 *         schema: { type: integer, default: 100 }
 *     responses:
 *       200: { description: OK }
 */
router.get("/mockingpets", asyncHandler(async (req, res) => {
  const count = Number(req.query.count ?? 100);
  const pets = makeArray(count, () => buildPet());
  res.json({ status: "success", payload: pets });
}));

/**
 * @openapi
 * /mocks/mockingusers:
 *   get:
 *     summary: Genera usuarios mockeados (NO inserta en DB)
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: qty
 *         schema: { type: integer, default: 50 }
 *       - in: query
 *         name: seed
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: adminRatio
 *         schema: { type: number, default: 0.3 }
 *     responses:
 *       200: { description: OK }
 */
router.get("/mockingusers", asyncHandler(async (req, res) => {
  const qty = Number(req.query.qty ?? 50);
  const seed = Number(req.query.seed ?? 0);
  const adminRatio = Number(req.query.adminRatio ?? 0.3);
  const users = makeArray(qty, (i) => buildUser({ index: i, seed, adminRatio }));
  res.json({ status: "success", payload: users });
}));

/**
 * @openapi
 * /mocks/generateData:
 *   post:
 *     summary: Genera e inserta usuarios y mascotas en la BD
 *     tags: [Mocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users: { type: integer, default: 10 }
 *               pets: { type: integer, default: 20 }
 *               link: { type: boolean, default: true }
 *     responses:
 *       201: { description: Insertados }
 */
router.post("/generateData", asyncHandler(async (req, res) => {
  const usersQty = Number(req.body?.users ?? 0);
  const petsQty  = Number(req.body?.pets ?? 0);
  const link     = Boolean(req.body?.link ?? true);

  const usersDocs = usersQty ? makeArray(usersQty, (i) => buildUser({ index: i })) : [];
  const petsDocs  = petsQty  ? makeArray(petsQty,  () => buildPet()) : [];

  let insertedUsers = [];
  let insertedPets  = [];

  if (usersDocs.length) {
    try { insertedUsers = await User.insertMany(usersDocs, { ordered: false }); }
    catch (e) { insertedUsers = e.insertedDocs ?? []; }
  }

  if (petsDocs.length) {
    if (link && insertedUsers.length) {
      const userIds = insertedUsers.map(u => u._id);
      for (const pet of petsDocs) {
        if (Math.random() < 0.5) {
          pet.owner = userIds[Math.floor(Math.random() * userIds.length)];
          pet.adopted = true;
        }
      }
    }
    try { insertedPets = await Pet.insertMany(petsDocs, { ordered: false }); }
    catch (e) { insertedPets = e.insertedDocs ?? []; }
  }

  res.status(201).json({
    status: "success",
    inserted: { users: insertedUsers.length, pets: insertedPets.length },
    linkedPets: link ? insertedPets.filter(p => p.owner).length : 0
  });
}));

export default router;
