import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

(async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Mongo conectado");
    app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Error al iniciar:", err);
    process.exit(1);
  }
})();
