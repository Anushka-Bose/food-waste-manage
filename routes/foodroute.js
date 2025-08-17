const express = require('express');
const router = express.Router();
const { protect } = require('./../middlewares/authmiddleware');
const upload = require('./../middlewares/uploadmiddleware');
const food = require('./../controllers/foodcontroller');

router.post('/', protect, upload.single('image'), food.createFoodListing);
router.get('/', food.getAvailableFood);
router.get('/:id', food.getFoodById);
router.put('/:id', protect, upload.single('image'), food.updateFoodListing);
router.delete('/:id', protect, food.deleteFoodListing);
router.patch('/:id/pickup', protect, food.markAsPicked);
router.patch('/:id/cancel-pickup', protect, food.cancelPickup);

module.exports = router;
