import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import httpStatus from "http-status";

const isProduction = process.env.NODE_ENV === "production";

const createSecretToken = (id , username , name ) => {                     //user ki id ka use karke token banaya
  return jwt.sign({id: id ,username: username , name: name }, process.env.TOKEN_KEY, {      // JWT me expiry set karne ka frontend cookies ki expiry se koi relation nahi. // JWT expiry ≠ Cookie expiry
    expiresIn: 3 * 24 * 60 * 60, //3 days in seconds  3 days ke liye sign kar rha hai 
  });
};

// jwt token in browser = header.payload.signature
// let token in Browser be     h.p.s if i change payload by P and send to backend to login my new user in P 
// backend makes new signature with   formula --> { sign(h + P + secret key) } which will not match with s of h.p.s as s was made from { sign(h + p + secret key) }
// hence token invalid



const Signup = async (req, res, next) => {
  try {
    const { name, username, password} = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); //  10 ka matlab salt rounds — yani password ko kitni baar complex hashing process se guzarna hai.
  
    const createdAt = new Date();
    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
      createdAt,
    });
    const token = createSecretToken(newUser._id , newUser.username ,newUser.name );
    // newUser.token = token;                       // inhe DB me save krane ki jarurat nahi JWT khud hi userid se verify kr leta hai
    // await newUser.save();

    // const token = crypto.randomBytes(20).toString('hex');
    // newUser.token = token;
    // await newUser.save();
    console.log("User signed up successfully");
     return res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      secure: isProduction,               // false on localhost (HTTP), true on production (HTTPS)
      sameSite: isProduction ? "none" : "lax",  // "none" requires secure:true, so use "lax" locally
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)  // saved in browser for 3 days in milliseconds
    })
    .status(httpStatus.CREATED).json({
      message: "User signed up successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Signup failed due to internal error" });
  }
};

const Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    if (!username || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ message: "No user exists with this username" });
    }

    const auth = await bcrypt.compare(password, user.password);
    console.log("password shi nikla :", auth);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    } else {
      let token = createSecretToken(user._id , user.username ,user.name );
      // user.token = token;
      // await user.save();
      console.log("User logged in successfully");
      return res
        .status(httpStatus.OK)
        .cookie("token", token, {
          withCredentials: true,
          httpOnly: true,
          secure: isProduction,               // false on localhost (HTTP), true on production (HTTPS)
          sameSite: isProduction ? "none" : "lax",  // "none" requires secure:true, so use "lax" locally
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // saved in browser for 3 days
        })
        .json({
          message: "User logged in successfully",
          success: true,
  
        });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
};

const Logout =  (req, res) => {
  try{
    res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),   // cookie turant expire
    sameSite: "none",
    secure: true,

  });

  
  return res.json({ message: "Logged out successfully", success: true });

  }catch(err){

  }
}
export { Signup, Login, Logout };