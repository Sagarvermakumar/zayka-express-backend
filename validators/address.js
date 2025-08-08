import { body } from "express-validator";

export const addressValidator = [
  body("addressLine").notEmpty().withMessage("addressLine is required"),
  body("landmark").notEmpty().isString().withMessage("Landmark must be a string"),
  body("city").notEmpty().withMessage("City is required"),
  body("state").notEmpty().withMessage("State is required"),
    body("country")
    .optional()
    .isString()
    .withMessage("Country must be a string"),
  // body("pinCode")
  //   .notEmpty()
  //   .isPostalCode("IN")
  //   .withMessage("Valid postal code is required"),
    body("label")
    .optional()
    .isIn(["Home", "Work", "Other"])
    .withMessage("Label must be one of Home, Work, or Other"),

 body("geo.latitude")
    .isNumeric({ min: -90, max: 90 })
    .withMessage("Latitude must be a number between -90 and 90"),
  body("geo.longitude")
    .isNumeric({ min: -180, max: 180 })
    .withMessage("Longitude must be a number between -180 and 180"),
];
