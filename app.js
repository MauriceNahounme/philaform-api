const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Import des routers
const { checkUser, requireAuth } = require("./controllers/auth");
const userRouter = require("./routes/user");
const memberRouter = require("./routes/member");

// Connexion à MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_CONFIG}@cluster0.27iaz.mongodb.net/philaform?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Auth
app.get("*", checkUser);
app.get("/jwt", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

//Routage
app.use("/users", userRouter);
app.use("/members", memberRouter);

//Export du module app
module.exports = app;
