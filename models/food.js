const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required."],
      trim: true,
      lowercase: true,
    },
    calories: {
      type: Number,
      default: 0,
      min: [0, "Calories cannot be negative."],
    },
  },
  {
    versionKey: false,
  }
);

const Food = mongoose.model("Food", FoodSchema);

module.exports = Food;
