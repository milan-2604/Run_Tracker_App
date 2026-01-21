import { Schema, Document, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  weight: number;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    weight: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

//userSchema.pre('save', fn)
//Before a User is saved to the database, run this function.
userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) return;//Only hash the password when it actually changes.

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = model<IUser>('User', userSchema);
export default User;
