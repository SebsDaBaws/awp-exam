import { mongoose } from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    timeCreatedAt: {
      type: Date,
      default: Date.now,
    },
    userid : {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ]
  },
  { timestamps: true }
);



const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
  },
  
});

export const models = [
  {
    name: "Post",
    schema: postSchema,
    collection: "posts",
  },
 
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
];
