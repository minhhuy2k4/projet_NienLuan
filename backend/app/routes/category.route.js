const express = require("express");
const categories = require("../controllers/category.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", categories.findAll);
router.get("/slug/:slug", categories.findBySlug);
router.get("/:id", categories.findOne);

// Admin only routes
router.post("/", auth, isAdmin, categories.create);
router.put("/:id", auth, isAdmin, categories.update);
router.delete("/:id", auth, isAdmin, categories.delete);

module.exports = router;
