import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { hashPassword, generateToken } from "@/utils/auth";
import { serialize } from "cookie";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return false;
  }
  try {
    connectToDB();
    const { firstName, lastName, username, password, email } = req.body;

    //validation
    if (!firstName || !lastName || !username || !password || !email) {
      return res.status(422).json({ messeage: "Data is not valid" });
    }
    //is User existed
    const isUserExist = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (isUserExist) {
      return res.status(422).json({ messeage: "user is existed" });
    }
    //Hash Password
    const hashedPassword = await hashPassword(password);
    //Generate Token
    const token = generateToken({ email });
    //Create
    const users=await UserModel.find({})
    await UserModel.create({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      email,
      role:users.length>0 ? "USER":"ADMIN"
    });

    return res
      .setHeader("Set-Cookie", serialize("token", token, {
        httpOnly:true,
        path:"/",
        maxAge:60*60*24
      }))
      .status(201)
      .json({ messeage: "user created successfully" });
  } catch (error) {
    return res.status(500).json({ messeage: "Internal server Error" });
  }
};

export default handler;
