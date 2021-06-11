const express = require('express')
const questionsController = require("../controllers/questionsController")
const router = express.Router()

// List Questions
router.get("/", questionsController.listQuestions)

// Find Questions by ID
router.get("/:id", questionsController.findOneQuestionByID)

// Create Question
router.post("/", questionsController.insertQuestion)

// Update Question by ID
router.patch("/:id", questionsController.updateQuestionById) 

// Delete Question by ID
router.delete("/:id", questionsController.deleteQuestionByID)

module.exports = router