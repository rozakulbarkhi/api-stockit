import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please enter your username"],
    trim: true,
    maxLength: 32,
    unique: true,
    index: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    trim: true,
    minLength: 6,
  },
});

userSchema.index({ username: 1 });

userSchema.plugin(uniqueValidator, {
  message: "username already taken!",
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);

      this.password = await bcrypt.hash(this.password, salt);

      next();
    }
  } catch (err) {
    next(err);
  }
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
