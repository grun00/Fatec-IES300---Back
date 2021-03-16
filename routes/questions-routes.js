const express = require('express')
const questionsController = require("../controllers/questionsController")
const router = express.Router()

// List Questions
router.get("/", questionsController.listQuestions)

// Find Questions by ID
router.get("/:id", questionsController.findOneQuestionByID)


module.exports = router