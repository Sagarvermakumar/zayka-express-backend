
import { body } from "express-validator";   

export const createMenuItemValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Price must be a positive number");
      }
      return true;
    }),
    body("category")
      .notEmpty()
      .withMessage("Category is required")
      .isString()
      .withMessage("Category must be a string")
      .isIn(["Appetizer", "Main Course", "Dessert"])
      .withMessage("Category must be one of the following: Appetizer, Main Course, Dessert"),
    body("isVegetarian")
      .optional()
      .isBoolean()
      .withMessage("isVegetarian must be a boolean"),
    body("isVegan")
      .optional()
      .isBoolean()
      .withMessage("isVegan must be a boolean"),
    body("ratings")
      .optional()
      .isNumeric()
      .withMessage("Ratings must be a number")
      .custom((value) => {
        if (value < 0 || value > 5) {
          throw new Error("Ratings must be between 0 and 5");
        }
        return true;
      }),
    body("reviews")
      .optional()
      .isNumeric()
      .withMessage("Reviews must be a number")
      .custom((value) => {
        if (value < 0) {
          throw new Error("Reviews cannot be negative");
        }
        return true;
      }),
    body("isAvailable")
      .optional()
      .isBoolean()
      .withMessage("isAvailable must be a boolean"),
  ];