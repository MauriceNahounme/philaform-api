const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ObjectID = require("mongoose").Types.ObjectId;
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/user");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(201).json(users);
  } catch (err) {
    res.status(400).json({ err });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      res
        .status(400)
        .json({ message: "L'id " + req.params.id + " est inconnu" });
    } else {
      const user = await User.findOne({ _id: req.params.id }).select(
        "-password"
      );
      res.status(201).json(user);
    }
  } catch (err) {
    res.status(400).json({ err });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      res
        .status(400)
        .json({ message: "L'id " + req.params.id + " est inconnu" });
    } else {
      await User.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Utilisateur bien supprimé" });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      res
        .status(400)
        .json({ message: "L'id " + req.params.id + " est inconnu" });
    } else {
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(400).json({ err });
  }
};

exports.signup = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  try {
    if (!user) {
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          const user = new User({ ...req.body, password: hash });
          user.save();
          res.status(201).json({ message: "Utilisateur bien crée" });
        })
        .catch((err) => {
          return res.status(500).json({ err });
        });
    } else {
      return res
        .status(400)
        .json({ message: "Cette adresse mail appartient déjà à un compte" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    const maxAge = 720 * 60 * 60 * 1000;
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    bcrypt.compare(req.body.password, user.password).then((valid) => {
      if (!valid) {
        return res.status(404).json({ message: "Mot de passe incorrect" });
      }

      const token = jwt.sign({ userID: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge,
      });
      res.cookie("token", token, { httpOnly: true, maxAge: maxAge });
      res.status(200).json({ user: user._id });
    });
  } catch (err) {
    res.status(400).json({ err });
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", "", { maxAge: 1 });
    res.redirect("/");
  } catch (err) {
    res.status(400).json({ err });
  }
};
