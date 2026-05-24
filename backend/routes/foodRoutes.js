import express from "express";
import Food from "../models/Food.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const food = new Food({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
      description: req.body.description,
    });

    const createdFood = await food.save();

    res.status(201).json(createdFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (food) {
      food.name = req.body.name || food.name;
      food.price = req.body.price || food.price;
      food.category = req.body.category || food.category;
      food.image = req.body.image || food.image;
      food.description = req.body.description || food.description;

      const updatedFood = await food.save();

      res.json(updatedFood);
    } else {
      res.status(404).json({ message: "Food not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (food) {
      await food.deleteOne();

      res.json({ message: "Food removed" });
    } else {
      res.status(404).json({ message: "Food not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;