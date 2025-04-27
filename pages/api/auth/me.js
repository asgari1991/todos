import connectToDB from "@/configs/db";
import userModel from "@/models/User";
import { verifyToken } from "@/utils/auth";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return false;
  }
  try {
    connectToDB();
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    const user = await userModel.findOne(
      { email: tokenPayload.email },
      "firstName lastName role"
    );
    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(500).json({ messeage: "Internal server Error" });
  }
};

export default handler;
