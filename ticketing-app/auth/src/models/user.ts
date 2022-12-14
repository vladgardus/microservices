import mongoose from "mongoose";
import { Password } from "../services/password";

export interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

class UserDoc extends mongoose.Document {
  email!: UserAttrs["email"];
  password!: UserAttrs["password"];
}

interface UserDTO {
  id: string;
  email: string;
}

export class UserMapper {
  static toDTO(user: UserDoc): UserDTO {
    return { id: user._id, email: user.email };
  }
}

const userSchema = new mongoose.Schema({ email: { type: String, required: true }, password: { type: String, required: true } });
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password") as UserAttrs["password"]);
    this.set("password", hashed);
  }
  done();
});

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
