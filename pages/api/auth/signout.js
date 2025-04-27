import { serialize } from "cookie";

const handler = (req, res) => {
  if (req.method !== "GET") {
    return false;
  }
  return res
    .setHeader(
      "Set-Cookie",
      serialize("token", "", {
        path: "/",
        maxAge: 0,
      })
    )
    .status(200)
    .json({ messeage: "user logged out successfully" });
};

export default handler;
