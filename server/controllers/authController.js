const User = require('../models/User');

// Register New User
exports.register = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// Login User
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email and password."
            })
        }

        const user = await User.findOne({email}).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// Get Current Logged In User
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    return res.status(statusCode).json({
        success: true,
        token, 
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
}

