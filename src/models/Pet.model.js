import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name     : { type: String, required: true },
  species  : { type: String, enum: ["dog","cat","bird","fish","other"], default: "dog" },
  birthDate: { type: Date, default: null },
  adopted  : { type: Boolean, default: false },
  owner    : { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });

export default mongoose.model("Pet", petSchema);
