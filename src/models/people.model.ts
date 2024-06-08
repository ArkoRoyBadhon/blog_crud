import mongoose from "mongoose";

const peopleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    home_phone: {
      type: String,
      required: true,
      unique: true,
    },
    work_phone: {
      type: String,
      required: true,
      unique: true,
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
