const express = require("express");
const upload = require("../middleware/upload");
const { uploadCSV } = require("../controllers/uploadController");

const router = express.Router();

router.post("/", upload.single("file"), uploadCSV);

module.exports = router;