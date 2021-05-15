const express = require('express')
const roomsController = require("../controllers/roomController")
const router = express.Router()

// List Items
router.get("/", roomsController.findRooms)

// Find Item by ID
router.get("/:id", roomsController.findOneRoomByID)

// Update Item by ID
router.patch("/:id", roomsController.updateRoomByID)

// Create Item
router.post("/", roomsController.insertRooms)

// Delete Item by ID
router.delete("/:id", roomsController.deleteRoomByID)

module.exports = router