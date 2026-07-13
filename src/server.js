import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// connectDB();

// app.listen(PORT, () => {

// console.log(`Server running on ${PORT}`);

// });

//The problem in above code was that the server was starting before the database connection was established. To fix this, we need to ensure that the database connection is established before starting the server.
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server Running`);
  });
};

startServer();
