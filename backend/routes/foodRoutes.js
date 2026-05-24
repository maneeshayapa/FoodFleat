import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const foods = [
    {
      id: 1,
      name: "Burger",
      price: 1200,
    },
    {
      id: 2,
      name: "Pizza",
      price: 2500,
    },
  ];

  res.json(foods);
});

router.post("/", (req, res) => {
  console.log(req.body);

  res.json({
    message: "Food received",
    data: req.body,
  });
});

export default router;