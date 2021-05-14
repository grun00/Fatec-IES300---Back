const express = require('express')
const itemsController = require("../controllers/itemsController")
const router = express.Router()

// List Items
router.get("/", itemsController.findItems)

// Find Item by ID
router.get("/:id", itemsController.findOneItemByID)

// Update Item by ID
router.patch("/:id", itemsController.updateItemByID)

// Create Item
router.post("/", itemsController.insertItems)

// Delete Item by ID
router.delete("/:id", itemsController.deleteItemByID)

module.exports = router