const express = require('express')
const playersController = require("../controllers/playersController")
const router = express.Router()

// List Players
router.get("/", playersController.listPlayers)

// Find Player by ID
router.get("/:id", playersController.findOnePlayerByID)

// Update Player by ID
router.patch("/:id", playersController.updatePlayerByID)

// Delete Player by ID
router.delete("/:id", playersController.deletePlayerByID)

// Find Players by username
router.get("/by_username/:username", playersController.findPlayerByUsername)

// Create Player
router.post("/", playersController.insertPlayer)

// Logins the Player
router.post("/login", playersController.loginPlayer)



module.exports = router
