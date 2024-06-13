const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const { FRONTEND_URL } = require('../config');

exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({
            message: 'User already exists'
        });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({
            message: 'Invalid email or password'
        });
    }
});

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found with that email" });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL to be sent to the user
    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `You recently requested to reset your password. Please go to the following link to reset your password: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Gumroad Password Reset',
            message,
            html: `<p>${message}</p>` // Here you can format your email with HTML if desired
        });

        res.status(200).json({ success: true, message: 'Email sent' });
    } catch (error) {
        // Reset modifications if sending email fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500).json({ message: 'Email could not be sent', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await User.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true });

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const resetToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpire: { $gt: Date.now() } // Check if token has not expired
    });

    if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    const token = generateToken(user._id);

    res.status(200).json({ success: true, token });
};

exports.logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // 10 seconds
        httpOnly: true
    });

    res.status(200).json({ success: true, message: 'User logged out successfully' });
};


function generateToken(id) {
    return jwt.sign({ id }, 'test', {
        expiresIn: '30d'
    });
}
