const Car = require('../models/car');
const cloudinary = require('../Middlewares/Cloudinary');

// Create a new car with bidding-related fields
module.exports.createCar = async (req, res, next) => {
  try {

        const {
          make,
          model,
          year,
          mileage,
          price,
          seller,
          description,
          condition,
          fuelType,
          location,
          contactPhone,
          images
        } = req.body;
        
       
        const imageUrls = [];
    
        // Upload images to Cloudinary and get URLs
        for (const base64Data of images) {
            const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Data}`);
            imageUrls.push(result.secure_url);
          }
    
    // Add bidding-related fields to the new car
    const newCar = new Car({
      make,
      model,
      year,
      mileage,
      price,
      seller,
      description,
      photos: imageUrls,
      condition,
      fuelType,
      location,
      contactPhone,
      isBiddingOpen: false, // Initialize as closed
      startingBid: 0, // Initialize starting bid amount
      currentBid: 0, // Initialize current highest bid amount
      bids: [], // Initialize empty bids array
    });
    await newCar.save();
    
    res.status(201).json({
      message: 'Car created successfully',
      car: newCar,
    });
    // ... (Your existing code for saving the car)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Start a bidding session for a car
module.exports.startBidding = async (req, res, next) => {
  try {
    // Retrieve the car by ID
    const carId = req.params.carId;
    console.log(carId);
    const car = await Car.findById(carId);

    // Check if the user making the request is the owner of the car
    if (car && car.seller.toString() === req.body.userId) {
      // Update the car to start the bidding session
      car.isBiddingOpen = true;
      car.startingBid = req.body.startingBid; // You can pass the starting bid amount in the request body
      await car.save();

      res.status(200).json({
        message: 'Bidding started successfully',
      });
    } else {
      res.status(403).json({ message: 'Permission denied' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports.getCars = async (req, res, next) => {
  try {
      const cars = await Car.find()
      .populate({
        path: 'bids.bidder',
        model: 'User', // Assuming the model name for users is 'User'
      })
      .populate('seller')
      .populate({
        path: 'winningBid.bidder',
        model: 'User', // Assuming the model name for users is 'User'

      }) // Populate the winningBid field, assuming it references the Bid model
      .populate('winningBidder'); // Populate the winningBidder field, assuming it references the User model
  
      res.status(200).json({
      cars,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
  };
// Place a bid on a car
module.exports.placeBid = async (req, res, next) => {
  try {
    // Retrieve the car by ID
    const carId = req.params.carId;
    const car = await Car.findById(carId);

    // Check if the car is open for bidding
    if (car && car.isBiddingOpen) {
      // Parse the bid amount from the request body
      const bidAmount = parseFloat(req.body.bidAmount);

      // Check if the bid amount is valid and higher than the current highest bid
      if (!isNaN(bidAmount) && bidAmount > car.currentBid) {
        // Update the car's current highest bid and add a new bid entry
        car.currentBid = bidAmount;
        car.bids.push({
          bidder: req.body.userId,
          bidAmount: bidAmount,
          bidTimestamp: new Date(),
        });

        // Save the updated car
        await car.save();

        res.status(200).json({
          message: 'Bid placed successfully',
        });
      } else {
        res.status(400).json({ message: 'Invalid bid amount' });
      }
    } else {
      res.status(403).json({ message: 'Bidding not open for this car' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Close the bidding session for a car
module.exports.closeBidding = async (req, res, next) => {
  try {
    // Retrieve the car by ID
    const carId = req.params.carId;
    const car = await Car.findById(carId);

    // Check if the user making the request is the owner of the car
    if (car && car.seller.toString() === req.user.id) {
      // Update the car to close the bidding session
      car.isBiddingOpen = false;
      await car.save();

      res.status(200).json({
        message: 'Bidding closed successfully',
      });
    } else {
      res.status(403).json({ message: 'Permission denied' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports.acceptBid = async (req, res, next) => {
  try {
    // Retrieve the car by ID
    const carId = req.params.carId;
    const car = await Car.findById(carId);

    // Check if the user making the request is the owner of the car
    if (car && car.seller.toString() === req.body.userId) {
      const bidId = req.params.bidId;

      // Find the bid in the car's bids array
      const bid = car.bids.find((b) => b._id.toString() === bidId);

      if (bid) {
        // Mark the bid as accepted
        bid.accepted = true;

        // Set the winningBid field in the car schema to the accepted bid's _id
        car.winningBid = bid._id;
        car.winningBidder = bid.bidder;
        car.isBiddingOpen = false;
        // Save the updated car
        await car.save();

        res.status(200).json({
          message: 'Bid accepted successfully',
        });
      } else {
        res.status(404).json({ message: 'Bid not found' });
      }
    } else {
      res.status(403).json({ message: 'Permission denied' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports.rejectBid = async (req, res, next) => {
  try {
    // Retrieve the car by ID
    const carId = req.params.carId;
    const car = await Car.findById(carId);

    // Check if the user making the request is the owner of the car
    if (car && car.seller.toString() === req.body.userId) {
      const bidId = req.params.bidId;

      // Find the bid in the car's bids array
      const bid = car.bids.find((b) => b._id.toString() === bidId);

      if (bid) {
        // Mark the bid as rejected
        bid.rejected = true;

        // Save the updated car
        await car.save();

        res.status(200).json({
          message: 'Bid rejected successfully',
        });
      } else {
        res.status(404).json({ message: 'Bid not found' });
      }
    } else {
      res.status(403).json({ message: 'Permission denied' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports.deleteCar = async (req, res, next) => {
    const carId = req.params.carId;
    
    try {
      const car = await Car.findById(carId);
      if (car) {
        await Car.findByIdAndDelete(carId);
        res.status(200).json({
          message: 'Car deleted successfully',
        });
        
      } else {
        res.status(404).json({ message: 'Car not found' });
      }
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
