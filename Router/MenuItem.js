import { Router } from "express";

import {
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsByCategory,
  getMenuItemsByMostRated,
  getMenuItemsByPriceRange,
  getNewMenuItems,
  getPopularMenuItems
} from "../controllers/MenuItem.js";

const menuItemRouter = Router();


/**
 * @desc    Get all menu items 
 * @route   GET /api/v1/menu-item
 * @access  Public (anyone can view menu items)
 */
menuItemRouter.get("/all", getAllMenuItems);



/**
 * @desc    Get a single menu item by ID
 * @route   GET /api/v1/menu-item/:id
 * @access  Public (anyone can view menu items)
 * @params  id - menu item ID
*/
menuItemRouter.get("/item/:id", getMenuItemById);




/** * @desc    Get popular menu items
 * @route   GET /api/v1/menu-item/popular
 * @access  Public (anyone can view popular menu items)
 */

menuItemRouter.get("/popular",  getPopularMenuItems);


/**
 * @desc    Get menu items by category
 * @route   GET /api/v1/menu-item/category/:category
 * @access  Public (anyone can view menu items by category)
 * @params  category - category name (e.g., Appetizer, Main Course, Dessert)
 */

menuItemRouter.get("/category/:category", getMenuItemsByCategory);


/**
 * @desc   Get New Menu Items
 * @route  GET /api/v1/menu-item/new
 * @access Public (anyone can view new menu items)
 */

menuItemRouter.get("/new", getNewMenuItems);  

/**
 * @desc  Get Menu Item by Price Range
 * @route GET /api/v1/menu-item/price-range
 * @access Public (anyone can view menu items by price range)
 */

menuItemRouter.get("/price-range", getMenuItemsByPriceRange);



/**
 * @desc get item by most rated
 * @route GET /api/v1/menu-item/most-rated
 * @access Public (anyone can view menu items by most rated)
 */

menuItemRouter.get("/most-rated/:rating", getMenuItemsByMostRated);




export default menuItemRouter;
