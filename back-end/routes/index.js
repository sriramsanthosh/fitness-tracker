const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');

router.get("/", homeController.home);
router.post("/register", homeController.register);
router.post("/add-weight", homeController.addWeight);
router.get("/get-weight", homeController.getWeight);

module.exports = router;