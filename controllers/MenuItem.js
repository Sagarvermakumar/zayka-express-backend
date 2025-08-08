import catchAsyncError from "../Middleware/CatchAsyncError.js";
import ErrorHandler from "../Middleware/Error.js";
import Address from "../Models/Address.js";
import MenuItem from "../Models/MenuItem.js";




/**
 * @desc    get all menu items that are available
 * @route   GET /api/v1/menu
 * @access  Public (anyone can view menu items)
 * @use     This endpoint allows users to view all available menu items
 */

export const getAllMenuItems = catchAsyncError(async (req, res, next) => {
  const { name, category, minPrice, maxPrice, isVegan, isVegetarian } = req.query;

  const query = { isAvailable: true };

  // 🔍 Text search by name (case-insensitive)
  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }

  // 🎯 Category filter
  if (category) {
    query.category = category;
  }

  // 💰 Price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // ✅ Boolean filters
  if (isVegan !== undefined) {
    query.isVegan = isVegan === 'true'; // Convert string to boolean
  }

  if (isVegetarian !== undefined) {
    query.isVegetarian = isVegetarian === 'true';
  }

  const menuItems = await MenuItem.find(query);

  if (menuItems.length === 0) {
    return next(new ErrorHandler("No menu items found matching the criteria", 404));
  }

  const count = await MenuItem.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Filtered menu items fetched successfully",
    count,
    menuItems,
  });
});

/**
 * @desc    Get a single menu item by ID
 * @route   GET /api/v1/menu/:id
 * @access  Public (anyone can view menu items)
 * @use     This endpoint allows users to view details of a specific menu item
 * @params  id - menu item ID
 */
export const getMenuItemById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const item = await MenuItem.findById(id);
  if (!item) return next(new ErrorHandler("Menu item not found", 404));

  res.status(200).json({
    success: true,
    message: "Menu item fetched successfully",
    menuItem: item,
  });
});




/**
 * @desc    Get popular menu items
 * @route   GET /api/v1/menu/popular
 * @access  Public (anyone can view popular menu items)
 * @use     This endpoint allows users to view popular menu items based on ratings or reviews
 */
export const getPopularMenuItems = catchAsyncError(async (req, res, next) => {
  // Fetch popular menu items based on ratings or reviews

  // You can adjust the criteria for popularity as needed
  // For example, you can fetch items with ratings above a certain threshold or those with the

  const menuItems = await MenuItem.find({ isAvailable: true })
    .sort({ ratings: -1 }) // Sort by ratings in descending order
    .limit(10); // Limit to top 10 popular items

  if (menuItems.length === 0)
    return next(new ErrorHandler("No popular menu items found", 404));

  res.status(200).json({
    success: true,
    message: "Popular menu items fetched successfully",
    menuItems,
  });
});

/**
 * @desc    Get new menu items
 * @route   GET /api/v1/menu/new
 * @access  Public (anyone can view new menu items)
 * @use     This endpoint allows users to view newly added menu items
 */

export const getNewMenuItems = catchAsyncError(async (req, res, next) => {
  // Fetch new menu items based on creation date
  const menuItems = await MenuItem.find({ isAvailable: true })
    .sort({ createdAt: -1 }) // Sort by creation date in descending order
    .limit(10); // Limit to top 10 new items

  if (menuItems.length === 0)
    return next(new ErrorHandler("No new menu items found", 404));

  res.status(200).json({
    success: true,
    message: "New menu items fetched successfully",
    menuItems,
  });
});



/**
 * @desc    Get menu items by price range
 * @route   GET /api/v1/menu/price-range
 * @access  Public (anyone can view menu items by price range)
 * @use     This endpoint allows users to view all menu items within a specific price range
 * @query   min - minimum price, max - maximum price
 */

export const getMenuItemsByPriceRange = catchAsyncError(
  async (req, res, next) => {
    const { min, max } = req.query;

    if (!min || !max)
      return next(new ErrorHandler("Price range is required", 400));

    // Validate price range
    if (isNaN(min) || isNaN(max) || Number(min) < 0 || Number(max) < 0)
      return next(new ErrorHandler("Invalid price range", 400));

    // Fetch menu items by price range
    const menuItems = await MenuItem.find({
      price: { $gte: Number(min), $lte: Number(max) },
      isAvailable: true,
    });

    if (menuItems.length === 0)
      return next(
        new ErrorHandler("No menu items found in this price range", 404)
      );

    res.status(200).json({
      success: true,
      message: "Menu items by price range fetched successfully",
      menuItems,
    });
  }
);

/**
 * @desc    Get menu items by rating
 * @route   GET /api/v1/menu/rating/:rating
 * @access  Public (anyone can view menu items by rating)
 * @use     This endpoint allows users to view all menu items with a specific rating or higher
 * @params  rating - minimum rating (0 to 5)
 */
export const getMenuItemsByMostRated = catchAsyncError(async (req, res, next) => {
  const { rating=1 } = req.params;

  // Fetch menu items by rating
  const menuItems = await MenuItem.find({
    ratings: { $gte: Number(rating) },
    isAvailable: true,
  });

  if (menuItems.length === 0)
    return next(new ErrorHandler("No menu items found with this rating", 404));

  res.status(200).json({
    success: true,
    message: "Menu items by rating fetched successfully",
    menuItems,
  });
});
/**
 * @desc    Get menu items by review count
 * @route   GET /api/v1/menu/reviews/:count
 * @access  Public (anyone can view menu items by review count)
 * @use     This endpoint allows users to view all menu items with a specific number of reviews or more
 * @params  count - minimum number of reviews
 */



/**
 * @desc    Get menu items by Category
 * @route   GET /api/v1/menu/category/:category 
 * @access  Public (anyone can view menu items by category)
 * @use     This endpoint allows users to view all menu items from a specific category
 * @params  category - category name
 */


export const getMenuItemsByCategory = catchAsyncError(
  async (req, res, next) => {
    const { category } = req.params;

    if (!category)
      return next(new ErrorHandler("Category is required", 400));

    // Fetch menu items by category
    const menuItems = await MenuItem.find({
      category: { $regex: category, $options: "i" },
      isAvailable: true,
    });

    if (menuItems.length === 0)
      return next(new ErrorHandler("No menu items found in this category", 404));

    res.status(200).json({
      success: true,
      message: "Menu items by category fetched successfully",
      menuItems,
    });
  }
);


