export const sendToken = (res, user, message, statusCode = 200) => {
  const token = user.getJWTToken();
  
  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true, 
      secure: true,
      sameSite: "strict", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      path: "/"
    })
    .json({
      success: true,
      message,
      user,
    });
};
