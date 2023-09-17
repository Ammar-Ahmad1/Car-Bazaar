const mongoose = require('mongoose');

// Define the car schema
const carSchema = new mongoose.Schema({
    // Basic car information
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    mileage: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    // Seller information
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to a User model for the seller
        required: true,
    },
    // Car description
    description: {
        type: String,
        required: true,
    },
    // Car photos (you can store image URLs or use a file storage system)
    photos: [{
        type: String,
    }],
    // Additional details
    condition: {
        type: String, // e.g., "New," "Used," "Certified Pre-Owned"
        required: true,
    },
    fuelType: {
        type: String,
    },
    // Location of the car
    location: {
        type: String,
        required: true,
    },
    contactPhone: {
        type: String,
    },
    // Date when the car was listed
    dateListed: {
        type: Date,
        default: Date.now,
    },
    // Bidding-related fields
    isBiddingOpen: {
        type: Boolean,
        default: false, // Initialize as closed
    },
    startingBid: {
        type: Number,
    },
    currentBid: {
        type: Number,
        default: 0, // Initialize with zero bids
    },
    bids: [{
        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to a User model for the bidder
        },
        bidAmount: {
            type: Number,
        },
        bidTimestamp: {
            type: Date,
        },
        accepted: {
            type: Boolean,
            default: false, // Initialize as false
        },
        rejected: {
            type: Boolean,
            default: false, // Initialize as false
        },
    }],
    winningBid: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'Bid', // Reference to a Bid model
        default: null, // Initialize as null and update when a bid wins
    },
    winningBidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to a User model
        default: null, // Initialize as null and update when a bid wins
    },
});

// Create the Car model using the schema
const Car = mongoose.model('Car', carSchema);

module.exports = Car;
