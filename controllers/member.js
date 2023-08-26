const Member = require("../models/member");
const ObjectID = require("mongoose").Types.ObjectId;
const dotenv = require("dotenv");
dotenv.config();

exports.getMembers = async (req, res, next) => {
  try {
    const membres = await Member.find();
    res.status(200).json(membres);
  } catch (err) {
    res.status(404).json({ err });
  }
};

exports.createMember = async (req, res, next) => {
  try {
    const member = new Member(req.body);
    member.save();
    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(404).json({ err });
  }
};

exports.updateMember = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(404).json({ message: "Id invalide" });
    } else {
      const member = req.body;
      await Member.updateOne(
        { _id: req.params.id },
        { ...member, _id: req.params.id }
      );
      return res.status(200).json({ message: "Modification réussie" });
    }
  } catch (err) {
    return res.status(404).json({ err });
  }
};

exports.deleteMember = async (req, res, next) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(404).json({ message: "Id invalid" });
    } else {
      await Member.deleteOne({ _id: req.params.id });
      return res.status(200).json({ message: "Suppression réussie" });
    }
  } catch (err) {
    return res.status(404).json({ err });
  }
};
