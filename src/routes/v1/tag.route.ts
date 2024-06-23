import express from "express";
import { createTagController, deleteTagController, getTagByIdController, getTagsController, updateTagController } from "../../controllers/tag.controller";
import { validateArticle } from "../../helpers/validArticle";
import { authorizeRoles } from "../../middlewares/auth";
const router = express.Router();

// employee personal Data
router.post("/t/create", validateArticle, authorizeRoles("author"), createTagController);
router.delete("/t/delete/:id", validateArticle, authorizeRoles("author"), deleteTagController);
router.patch("/t/update/:id", validateArticle, authorizeRoles("author"), updateTagController);
router.get("/t/get", getTagsController);
router.get("/t/get/:id", getTagByIdController);


export default router;