import { Router } from "express";
import Snippet from "../models/snippets.model.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

// CREATE
router.post("/create", auth, async (req, res) => {
  try {
    const { title, language, code, tags } = req.body;

    const newSnippet = new Snippet({
      title,
      language,
      code,
      tags,
      userId: req.userId, // req.userId comes from auth middleware
    });

    await newSnippet.save();
    res.status(201).json(newSnippet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  GET ALL
router.get("/all", auth, async (req, res) => {
  try {
    const { q } = req.query;

    let query = { userId: req.userId };

    if (q) {
      //  $and ensures only search WITHIN this user's snippets
      query = {
        $and: [
          { userId: req.userId },
          {
            $or: [
              { title: { $regex: q, $options: "i" } },
              { language: { $regex: q, $options: "i" } },
              { tags: { $regex: q, $options: "i" } },
            ],
          },
        ],
      };
    }

    const snippets = await Snippet.find(query).sort({ createdAt: -1 });
    res.status(200).json(snippets);
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

//  DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) return res.status(404).json({ message: "Snippet not found" });

    // Ensure the person deleting it actually owns it
    if (snippet.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: This is not your snippet" });
    }

    await Snippet.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Snippet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) return res.status(404).json({ message: "Snippet not found" });

    // Ensure the person updating it actually owns it
    if (snippet.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const updatedSnippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    res.status(200).json(updatedSnippet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
