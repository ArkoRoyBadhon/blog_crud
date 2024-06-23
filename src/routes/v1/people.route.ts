import express from "express";
// import { CreatePeopleController, getAllPeople } from "../../controllers/auth.controller";
import { validatePeople } from "../../helpers/validPeople";
import { registerUserController, signinController } from "../../controllers/auth.controller";
const router = express.Router();

// employee personal Data
// router.post("/a/create",validatePeople, CreatePeopleController);
router.post("/register", registerUserController);
router.post("/login", signinController);
// router.get("/all/get", getAllPeople);


export default router;