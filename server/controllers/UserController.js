const User = require("../models/user");
// const bcrypt = require("bcryptjs");


// const bcrypt = require('bcrypt'); // Import bcrypt library

module.exports.registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email: email }); // Use findOne to get a single user by email

        if (user) {
            console.log(user); // Log the user object
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // const hash = await bcrypt.hash(password, 12); // Hash the password
        const newUser = new User({
            name,
            email,
            password, // Save the hashed password
        });
        
        newUser
            .save()
            .then((userData) => {
                res.status(201).json({
                    userData,
                });
            })
            .catch((err) => {
                controllerError(err, res, 'Error occurred');
            });
    } catch (error) {
        controllerError(error, res, 'Error occurred');
    }
};

module.exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            users,
        });
    } catch (error) {
        controllerError(error, res, 'Error occurred');
    }
}
module.exports.updateUser = async (req, res, next) => {
    const { name, email} = req.body;
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({
                message: "User does not exist",
            });
        }
        if(name){
        user.name = name;
        }
        if(email){
        user.email = email;
        }
        await user.save();
        await user.save();
        res.status(200).json({
            user,
            message:"User updated successfully"
        });
    } catch (error) {
        controllerError(error, res, 'Error occurred');
    }
}

module.exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email,password)
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist",
            });
        }
        
        const isMatch = password === user.password;
        if(!isMatch){
            console.log("hello")
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }
        
        res.status(200).json({
            user,
        });
    }
    catch (error) {
        controllerError(error, res, 'Error occurred');
    }
}
