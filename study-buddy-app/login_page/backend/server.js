const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const organizationRoutes = require("./routes/organizationRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/org", organizationRoutes);
app.use("/api/user", userRoutes);

app.listen(process.env.PORT, () => {

  console.log("Server running on port 5000");

});