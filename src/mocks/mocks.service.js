import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS ?? 9);
export const HASH_CODER123 = bcrypt.hashSync("coder123", SALT_ROUNDS);
const oid = () => new mongoose.Types.ObjectId();

// Usuario estilo Mongo
export function buildUser({ index = 0, seed = 0, adminRatio = 0.3 } = {}) {
  if (seed) faker.seed(seed);
  const first = faker.person.firstName();
  const last  = faker.person.lastName();
  const email = `${first}.${last}.${index}.${faker.string.alphanumeric(4)}@mail.test`.toLowerCase();
  const isAdmin = Math.random() < Number(adminRatio);

  return {
    _id: oid(),
    first_name: first,
    last_name : last,
    email,
    password  : HASH_CODER123,   // "coder123" encriptada
    role      : isAdmin ? "admin" : "user",
    pets      : [],
    createdAt : new Date(),
    updatedAt : new Date(),
    __v       : 0
  };
}

// Mascota estilo Mongo
export function buildPet() {
  return {
    _id: oid(),
    // En Faker v9 no existe animal.petName; usamos un nombre de persona como nombre de mascota
    name: faker.person.firstName(),
    species: faker.helpers.arrayElement(["dog","cat","bird","fish","other"]),
    birthDate: faker.date.past({ years: 12 }),
    adopted: false,
    owner: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  };
}


// Helper
export function makeArray(n, factory) {
  const qty = Number.isFinite(n) && n > 0 ? n : 1;
  return Array.from({ length: qty }, (_, i) => factory(i));
}
