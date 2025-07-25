import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Import all routes from one file
import router from "./src/routes/router.js";
app.use("/api", router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
