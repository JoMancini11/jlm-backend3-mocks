import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema({
  petId : { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending","approved","rejected"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Adoption", adoptionSchema);
