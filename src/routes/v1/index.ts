import express from "express";
const router = express.Router();

import people from "./people.route";
import article from "./article.route";
import tag from "./tag.route";
import category from "./category.route";
import comment from "./comment.route";
import application from "./application.route";
import uploadFile from "./fileupload.route";

router.use("/user", people);
router.use("/article", article);
router.use("/tag", tag);
router.use("/category", category);
router.use("/comment", comment);
router.use("/apply", application);
router.use("/file", uploadFile);

export default router;
