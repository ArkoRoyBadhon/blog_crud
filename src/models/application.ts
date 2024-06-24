import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "People",
    },
    status: {
      type: String,
      enum: ["accepted", "block", "pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Application", applicationSchema);
