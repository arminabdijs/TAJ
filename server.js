require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

async function connectToDB() {
  try {
    const mongoUrl = process.env.MONGO_URL;
    console.log("📦 MONGO_URL from .env:", mongoUrl); 

    await mongoose.connect(mongoUrl);

    console.log(`✅ MongoDB Connected to host: ${mongoose.connection.host}`);
    console.log(`📂 Current database name: ${mongoose.connection.name}`);
  } catch (err) {
    console.error(`❌ Error in mongoose connection: ${err.message}`);
    process.exit(1);
  }
}


async function startServer() {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
}

async function run() {
  await connectToDB();
  await startServer();
}

run();
