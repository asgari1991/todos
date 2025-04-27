import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
        return false
    }else{
        await mongoose.connect("mongodb://localhost:27017/next-auth")
        console.log("Connectd to DB successfully");
        
    }
  } catch (err) {
    console.log("DB Connection has an Error=> ", err);
  }
};
export default connectToDB;
