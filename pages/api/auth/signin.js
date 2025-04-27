import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { generateToken, verifyPassword } from "@/utils/auth";
import { serialize } from "cookie";
const handler=async(req,res)=>{
    if (req.method !== "POST") {
        return false;
      }
      try {
        connectToDB()
        const {identifier,password}=req.body
        if (!identifier.trim()|| !password.trim()) {
            return res.status(422).json({ messeage: "Data is not valid" });
        }
        const user=await UserModel.findOne({
            $or: [{ username:identifier }, { email:identifier }]
        })
        if (!user) {
            return res.status(404).json({ messeage: "User doesnt Exist" });
        }
        const isValidPassword=await verifyPassword(password,user.password)
        if (!isValidPassword) {
            return res.status(422).json({ messeage: "Username or password is not correct" });
        }
        const token=generateToken({email:user.email})
        return res
              .setHeader("Set-Cookie", serialize("token", token, {
                httpOnly:true,
                path:"/",
                maxAge:60*60*24
              }))
              .status(200)
              .json({ messeage: "user logged in successfully" });
      } catch (error) {
        return res.status(500).json({ messeage: "Internal server Error" });
      }
}

export default handler