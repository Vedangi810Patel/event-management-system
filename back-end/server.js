const express = require("express");
const sequelize = require("./configs/dbConfig");
const path = require("path");
const bodyParser = require("body-parser");
const Routes = require("./routes/mainRouter");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(
  "/public/assets",
  express.static(path.join(__dirname, "public", "assets"))
);

app.use(Routes);

sequelize;
app.listen(5000);