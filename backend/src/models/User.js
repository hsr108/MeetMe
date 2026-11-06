import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  // Stored lowercase so lookups and the unique index are case-insensitive.
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  // Legacy field kept so existing documents still match the schema; tokens are not stored.
  token: { type: String },
  // Function reference: evaluated per document, not once at module load.
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
