import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    URL: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "People",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Comment", commentSchema);
