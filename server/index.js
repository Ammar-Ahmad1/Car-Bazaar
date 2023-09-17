const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const url = process.env.MONGO_URI

app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({limit: '50mb',extended: true}));
app.use(express.json({limit: '50mb', extended: true}));
app.use(cors());

app.use("/user", require("./routes/UserRoute"));
app.use("/car", require("./routes/CarRoutes"));
// 
//Database and server created
const PORT = process.env.PORT || 5000;
mongoose
  .connect(url, {
    dbName: "CarBazaar",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected...");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("Error occurred");
  });


