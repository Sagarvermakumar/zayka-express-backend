// The callback to execute when the Promise is rejected.
// Attaches a callback for only the rejection of the Promise.
// @returns — A Promise for the completion of the callback

const catchAsyncError = (passedFunction) => (req, res, next) => {
  Promise.resolve(passedFunction(req, res, next)).catch(next);
};

export default catchAsyncError;
// next : call error handler
