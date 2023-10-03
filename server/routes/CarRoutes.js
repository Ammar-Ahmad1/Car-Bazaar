const { createCar, getCars, startBidding, placeBid, closeBidding, acceptBid, rejectBid,deleteCar } = require('../controllers/CarController');
const upload = require('../Middlewares/multer');

const router = require('express').Router();

// Create a new car with bidding-related fields
router.post('/create-car', upload.array('images', 5), createCar);

// Get a list of cars
router.get('/get-cars', getCars);

// Start a bidding session for a car
router.post('/start-bidding/:carId', startBidding);

// Place a bid on a car
router.post('/place-bid/:carId', placeBid);

// Close the bidding session for a car
router.post('/close-bidding/:carId', closeBidding);
// Accept a bid on a car
router.post('/accept-bid/:carId/:bidId', acceptBid);

// Reject a bid on a car
router.post('/reject-bid/:carId/:bidId', rejectBid);

// Delete a car
router.delete('/delete-car/:carId', deleteCar);

module.exports = router;
