import connectToDB from "@/configs/db";
import todoModel from "@/models/Todo";
import userModel from "@/models/User";
import { verifyToken } from "@/utils/auth";

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

  const user = await userModel.findOne({ email: tokenPayload.email });
  if (req.method !== "GET") {
    const todos=await todoModel.find({user:user._id})
    return res.json(todos)
  } else if (req.method === "POST") {
    const { title, isCompleted } = req.body;
    const newTodo = { title, isCompleted, user: user._id };
    await todoModel.create(newTodo);
    return res.status(201).json({ message: "Todo Created successfully" });
  } else {
    return false;
  }
};

export default handler;
