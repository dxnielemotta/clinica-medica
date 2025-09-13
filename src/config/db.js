import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const mongoURI = process.env.mongoURI;

    if (!mongoURI) {
      throw new Error("Mongo URI não foi definida no arquivo .env");
    }

    await mongoose.connect(mongoURI);
  } catch (error) {
    console.error("Erro ao conectar ao mongoDB", error.message);
  }
};

export default dbConnection;
