import mongoose from "mongoose";

const peopleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    home_phone: {
      type: String,
      // required: true,
      unique: true,
    },
    work_phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "author", "regular"],
      default: "regular",
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

peopleSchema.virtual("articles", {
  ref: "Article",
  localField: "_id",
  foreignField: "author",
  justOne: false,
});

peopleSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "author",
  justOne: false,
});

peopleSchema.set("toObject", { virtuals: true });
peopleSchema.set("toJSON", { virtuals: true });

export default mongoose.model("People", peopleSchema);
