import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    // Storing the hash, never the plaintext. Hashing (bcrypt) and
    // comparePassword() are implemented in Step 5.
    passwordHash: {
      type: String,
      required: true,
      select: false, // never returned by default on find/findOne
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Instance method: doc.comparePassword("plaintext") -> boolean.
// `this.passwordHash` is only available when the query explicitly
// used .select("+passwordHash"), since the field defaults to hidden.
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

export const User = mongoose.model("User", userSchema);
