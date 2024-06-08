import { check } from "express-validator";

export const validatePeople = [
  check("name", "Name is required")
  .isLength({ min: 3 }),
];
