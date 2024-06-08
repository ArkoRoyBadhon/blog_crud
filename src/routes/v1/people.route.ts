import express from "express";
import { CreatePeopleController, getAllPeople } from "../../controllers/people.controller";
import { validatePeople } from "../../helpers/validPeople";
const router = express.Router();

// employee personal Data
router.post("/a/create",validatePeople, CreatePeopleController);
router.get("/all/get", getAllPeople);


export default router;