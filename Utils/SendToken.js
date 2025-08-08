export const sendToken = (res, user, message, statusCode = 200) => {
  const token = user.getJWTToken();
  

  const options = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    // secure:true,
    sameSite: "none",
  };

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: false, // Change to true if using HTTPS
      sameSite: "lax", // Use 'none' if frontend & backend are on different domains
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    })
    .json({
      success: true,
      message,
      user,
    });
};
