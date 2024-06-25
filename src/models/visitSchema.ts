import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    article: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Article",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Visit", visitSchema);
