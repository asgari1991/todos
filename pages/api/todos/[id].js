import connectToDB from "@/configs/db";
import { verifyToken } from "@/utils/auth";

const { default: todoModel } = require("@/models/Todo");
const { default: userModel } = require("@/models/User");

const handler = async (req, res) => {
  connectToDB();
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "You are not logged in" });
  }
  const tokenPayload = verifyToken(token);
  if (!tokenPayload) {
    return res.status(401).json({ message: "You are not logged in" });
  }
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const removedTodo = await todoModel.findOneAndDelete({ _id: id });
      return res.json({ message: "Todo removed successfully" });
    } catch (error) {
      return res.status(500).json({ messeage: "Internal server Error" });
    }
  }
};
export default handler;
