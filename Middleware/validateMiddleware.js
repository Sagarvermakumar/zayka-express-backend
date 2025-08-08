// middlewares/validateMiddleware.js
import { validationResult } from "express-validator";

/**
 * Middleware to validate request data using express-validator.
 * If there are validation errors, it responds with a 400 status and the error details.
 * If there are no errors, it calls the next middleware in the stack.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
      if (!errors.isEmpty()) {
      const message = errors.array().map(err => `• ${err.msg}`).join('\n');
      // const message = "<ul>" + errors.array().map(err => `<li>${err.msg}</li>`).join('') + "</ul>";
      console.error("Validation errors:", message);
      return res.status(400).json({
        success: false,
        message
      });
    }
  next();
};
