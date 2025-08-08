import catchAsyncError from "../Middleware/CatchAsyncError.js";
import Address from "../Models/Address.js";
import ErrorHandler from "../Middleware/Error.js";

/**
 * @desc create new address
 * @route   POST /api/v1/address
 * @access  Private
 *
 */

export const createAddress = catchAsyncError(async (req, res, next) => {
  const {
    label,
    addressLine,
    landmark,
    city,
    state,
    country,
    pinCode,
    geo,
    isDefaultAddress,
  } = req.body;


  // Check if the address already exists for this user
  const existingAddress = await Address.findOne({
    user: req.user._id,
    addressLine,
    city,
    state,
    pinCode,
    isDefaultAddress: isDefaultAddress || false,
  });

  if (existingAddress) {
    return next(new ErrorHandler("This address already exists", 409));
  }

  await Address.updateMany({ user: req.user._id }, { isDefaultAddress: false });

  const newAddress = await Address.create({
    user: req.user._id,
    isDefaultAddress: isDefaultAddress || false,
    label,
    addressLine,
    landmark,
    city,
    state,
    country: country || "India",
    pinCode,
    geo,
  });

  res.status(201).json({
    success: true,
    message: "Address created successfully",
    address: newAddress,
  });
});

/**
 * @desc Get all addresses of the logged-in user or specific user
 * @route   GET /api/v1/address
 * @access  Private
 */

export const getAllAddresses = catchAsyncError(async (req, res, next) => {
  const addresses = await Address.find({ user: req.user._id });

  if (!addresses || addresses.length === 0) {
    return next(new ErrorHandler("No addresses found", 404));
  }

  //address count
  const count = await Address.countDocuments({ user: req.user._id });

  res.status(200).json({
    success: true,
    message: "All Addresses",
    count,
    addresses,
  });
});

/**
 * @desc Update an existing address
 * @route   PUT /api/v1/address/:id
 * @access  Private
 */
export const updateAddress = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // Build update object only with fields present in req.body
  const updateFields = {};

  const allowedFields = [
    "label",
    "addressLine",
    "landmark",
    "city",
    "state",
    "country",
    "pinCode",
    "geo",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateFields[field] = req.body[field];
    }
  });

  // Optionally add fullName and phoneNumber from user if needed
  if (req.user?.name) {
    updateFields.fullName = req.user.name;
  }
  if (req.user?.phoneNumber) {
    updateFields.phoneNumber = req.user.phoneNumber;
  }

  const address = await Address.findByIdAndUpdate(id, updateFields, {
    new: true,
  });

  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    address,
  });
});

/**
 * @desc Delete an address
 * @route   DELETE /api/v1/address/:id
 * @access  Private
 */
export const deleteAddress = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;



  const allAddress = await Address.find({ user: req.user._id });
  if (allAddress.length < 1) {
    return next(new ErrorHandler("You must have at least one address", 400));
  } 

    const address = await Address.findByIdAndDelete(id);

  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }

  // set another address as default if the deleted address was default
  if (address.isDefaultAddress) {
    const newDefaultAddress = allAddress[0];
    newDefaultAddress.isDefaultAddress = true;
    await newDefaultAddress.save();
  }

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});

/**
 * @desc Set an address as default
 * @route   PUT /api/v1/address/:id/default
 * @access  Private
 */

export const setDefaultAddress = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // Reset all addresses to not default
  await Address.updateMany({ user: req.user._id }, { isDefaultAddress: false });

  // Set the specified address as default
  const address = await Address.findByIdAndUpdate(
    id,
    { isDefaultAddress: true },
    { new: true }
  );

  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }

  res.status(200).json({
    success: true,
    message: ` Your ${address.label} - ${address.addressLine}  set as default successfully`,
    address,
  });
});
/**
 * @desc Get the default address of the logged-in user
 * @route   GET /api/v1/address/default
 * @access  Private
 */

export const getDefaultAddress = catchAsyncError(async (req, res, next) => {
  const address = await Address.findOne({
    user: req.user._id,
    isDefaultAddress: true,
  });

  if (!address) {
    return next(new ErrorHandler("No default address found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Your default address",
    address,
  });
});
