import mongoose from "mongoose";
const snippetModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "javascript",
    },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  },
);

const Snippet = mongoose.model("Snippet", snippetModel);
export default Snippet;
