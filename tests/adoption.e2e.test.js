import 'dotenv/config';
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import Pet from "../src/models/Pet.model.js";
import User from "../src/models/User.model.js";

let createdId, userId, petId;

beforeAll(async () => {
  // Conectado por server.js, pero para jest es útil asegurar conexión
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/backend3");
  }
  await Pet.deleteMany({});
  await User.deleteMany({});
  const u = await User.create({ first_name:"Test", last_name:"User", email:"t@t.com", password:"x", role:"user", pets:[] });
  const p = await Pet.create({ name:"Doggo", species:"dog", adopted:false });
  userId = u._id.toString();
  petId  = p._id.toString();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Adoption Router E2E", () => {
  test("GET /api/adoption -> 200 array", async () => {
    const res = await request(app).get("/api/adoption");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/adoption -> 201 crea", async () => {
    const res = await request(app).post("/api/adoption").send({ petId, userId, status:"pending" });
    expect([201,200]).toContain(res.status);
    createdId = res.body._id || res.body.id;
    expect(createdId).toBeDefined();
  });

  test("POST /api/adoption -> 400 faltantes", async () => {
    const res = await request(app).post("/api/adoption").send({ petId });
    expect([400,422]).toContain(res.status);
  });

  test("GET /api/adoption/:id -> 200", async () => {
    const res = await request(app).get(`/api/adoption/${createdId}`);
    expect(res.status).toBe(200);
  });

  test("GET /api/adoption/:id -> 404", async () => {
    const res = await request(app).get("/api/adoption/66aabbccddeeff0011223344");
    expect([404,400]).toContain(res.status);
  });

  test("PUT /api/adoption/:id -> 200", async () => {
    const res = await request(app).put(`/api/adoption/${createdId}`).send({ status:"approved" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("approved");
  });

  test("PUT /api/adoption/:id -> 404", async () => {
    const res = await request(app).put("/api/adoption/66aabbccddeeff0011223344").send({ status:"approved" });
    expect([404,400]).toContain(res.status);
  });

  test("DELETE /api/adoption/:id -> 204", async () => {
    const res = await request(app).delete(`/api/adoption/${createdId}`);
    expect([204,200]).toContain(res.status);
  });

  test("DELETE /api/adoption/:id -> 404", async () => {
    const res = await request(app).delete("/api/adoption/66aabbccddeeff0011223344");
    expect([404,400]).toContain(res.status);
  });
});
