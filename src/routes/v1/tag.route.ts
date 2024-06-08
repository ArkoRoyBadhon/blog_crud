import express from "express";
import { createTagController, deleteTagController, getTagByIdController, getTagsController, updateTagController } from "../../controllers/tag.controller";
const router = express.Router();

// employee personal Data
router.post("/t/create", createTagController);
router.delete("/t/delete/:id", deleteTagController);
router.patch("/t/update/:id", updateTagController);
router.get("/t/get", getTagsController);
router.get("/t/get/:id", getTagByIdController);


export default router;