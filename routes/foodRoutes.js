const express = require("express");
const mongoose = require("mongoose");
const Food = require("../models/food");

const router = express.Router();
const allowedFields = new Set(["name", "calories"]);

function validatePayload(payload, res) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    res.status(400).json({
      message: "Request body must be a JSON object.",
    });
    return false;
  }

  const keys = Object.keys(payload);
  if (keys.length === 0) {
    res.status(400).json({
      message: "Request body must contain at least one field.",
    });
    return false;
  }

  const unsupportedFields = keys.filter((key) => !allowedFields.has(key));
  if (unsupportedFields.length > 0) {
    res.status(400).json({
      message: "Only name and calories fields are allowed.",
      unsupportedFields,
    });
    return false;
  }

  return true;
}

// READ: return all food documents.
router.get("/foods", async (req, res, next) => {
  try {
    const foods = await Food.find({}).sort({ name: 1 });
    res.status(200).json(foods);
  } catch (error) {
    next(error);
  }
});

// CREATE: add one food document.
router.post("/food", async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Request body must be a JSON object.",
      });
    }

    const food = new Food({
      name: req.body.name,
      ...(Object.prototype.hasOwnProperty.call(req.body, "calories")
        ? { calories: req.body.calories }
        : {}),
    });

    const savedFood = await food.save();
    return res.status(201).json(savedFood);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError ||
        error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        message: "Food data is invalid.",
        details: error.message,
      });
    }

    return next(error);
  }
});

// UPDATE: update the supplied fields for one food document.
router.patch("/food/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid food ID." });
    }

    if (!validatePayload(req.body, res)) {
      return;
    }

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updatedFood) {
      return res.status(404).json({ message: "Food item not found." });
    }

    return res.status(200).json(updatedFood);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError ||
        error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        message: "Food data is invalid.",
        details: error.message,
      });
    }

    return next(error);
  }
});

// DELETE: remove one food document.
router.delete("/food/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid food ID." });
    }

    const deletedFood = await Food.findByIdAndDelete(req.params.id);

    if (!deletedFood) {
      return res.status(404).json({ message: "Food item not found." });
    }

    return res.status(200).json({
      message: "Food item deleted successfully.",
      food: deletedFood,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
