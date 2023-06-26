import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI.replace("<password>", process.env.MONGO_PASS),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`DB connected at ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
