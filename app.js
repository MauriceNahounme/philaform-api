const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://philaform.netlify.app",
  })
);

// Import des routers
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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Routage
app.use("/users", userRouter);
app.use("/members", memberRouter);

//Export du module app
module.exports = app;
