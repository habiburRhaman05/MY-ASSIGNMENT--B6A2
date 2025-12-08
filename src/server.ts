import dotenv from "dotenv";
import app from "./app";
import { connectDatabase } from "./config/db";
import { initializeTables } from "./config/dbInit";
import "./utils/auto-status-update";
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

// Booom and start the server
(async () => {
  try {
    await connectDatabase();
    await initializeTables();
    await startServer();
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
})();
