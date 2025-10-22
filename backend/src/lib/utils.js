import jwt from "jsonwebtoken";
export const generateToken = (userId, res) => {
  // ✅ Use 'id' instead of 'userId' to match protectRoute
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,//ms
        httpOnly:true,//prevent client side js to access the cookie or (// JavaScript on the browser can't access this cookie)
        sameSite:"strict",//csrf attacks cross site request forgery
        secure:process.env.NODE_ENV!=="development"//https
    });
    return token;
}
//stores the token in a cookie "jwt" on the user's browser.