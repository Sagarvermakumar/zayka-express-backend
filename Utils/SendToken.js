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
     res.cookie("token", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/"
      })
    .json({
      success: true,
      message,
      user,
    });
};


