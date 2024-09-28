import { connect } from "mongoose";
import { ENV_KEY } from "../../constants/env.constants.js";

const mongoDbConnect = async () => {
  try {
    await connect(ENV_KEY.MONGODB_URI, {
    });
    console.log("MongoDB connection 성공");
  } catch (error) {
    console.error("MongoDB connection 실패");
    process.exit(1);
  }
};

export { mongoDbConnect };
