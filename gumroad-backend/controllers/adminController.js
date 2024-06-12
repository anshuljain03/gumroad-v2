const express = require('express');
const router = express.Router();
const Link = require('../models/Link'); 
const User = require('../models/User'); 
const Purchase = require('../models/Purchase');

exports.adminStats = async (req, res) => {
    try {
        const numberOfLinks = await Link.countDocuments();
        const numberOfUsers = await User.countDocuments();
        const purchaseStats = await Purchase.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$price" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    count: 1,
                    average: { $divide: ["$total", "$count"] }
                }
            }
        ]);

        const viewsAndDownloads = await Link.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$numberOfViews" },
                    totalDownloads: { $sum: "$numberOfPaidDownloads" }
                }
            }
        ]);

        function convertMsToTime(milliseconds) {
            const seconds = Math.floor(milliseconds / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
        
            const minutesLeft = minutes % 60;
            const hoursLeft = hours % 24;
            const secondsLeft = seconds % 60;
        
            return `${days} days, ${hoursLeft} hours, ${minutesLeft} minutes, ${secondsLeft} seconds`;
        }

        const lastLink = await Link.findOne().sort({ createDate: -1 });
        const lastPurchase = await Purchase.findOne().sort({ createDate: -1 });
        console.log('lastLink', lastLink, 'lastPurchase', lastPurchase);
        const stats = {
            numberOfLinks,
            numberOfUsers,
            purchaseTotal: purchaseStats[0] ? purchaseStats[0].total : 0,
            numberOfPurchases: purchaseStats[0] ? purchaseStats[0].count : 0,
            averagePurchase: purchaseStats[0] ? (purchaseStats[0].average).toFixed(2) : 0,
            numberOfViews: viewsAndDownloads[0] ? viewsAndDownloads[0].totalViews : 0,
            averageViews: viewsAndDownloads[0] ? (viewsAndDownloads[0].totalViews / numberOfLinks).toFixed(2) : 0,
            averageDownloads: viewsAndDownloads[0] ? (viewsAndDownloads[0].totalDownloads / numberOfLinks).toFixed(2) : 0,
            numberOfDownloads: viewsAndDownloads[0] ? viewsAndDownloads[0].totalDownloads : 0,
            lastLinkDate: convertMsToTime(lastLink ? new Date() - lastLink.createDate : 0),
            lastPurchaseDate: convertMsToTime(lastPurchase ? new Date() - lastPurchase.createDate : 0)
        };

        res.json(stats);
    } catch (error) {
        console.error('Failed to fetch stats', error);
        res.status(500).json({ message: 'Failed to fetch stats', error: error });
    }
};
