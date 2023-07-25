const express = require("express");
const router = express.Router();

const memberCtrl = require("../controllers/member");

router.post("/", memberCtrl.createMember);
router.get("/", memberCtrl.getMembers);
// router.get("/:id", memberCtrl.getMedia);
router.put("/:id", memberCtrl.updateMember);
router.delete("/:id", memberCtrl.deleteMember);

module.exports = router;
