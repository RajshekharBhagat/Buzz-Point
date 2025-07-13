import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface User extends Document {
  _id: Types.ObjectId;
  name: string;
  // username?: string;
  email: string;
  password?: string;
  image?:string;
  createdAt: Date;
}

const UserSchema: Schema<User> = new Schema ({
  name: {
    type: String,
    required: true
  },
  // username: {
  //   type: String,
  //   required: false,
  //   // unique: true,
  //   default: function() {
  //     return `user_${nanoid(8)}`
  //   }
  // },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
},{timestamps: true});

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default UserModel as Model<User>