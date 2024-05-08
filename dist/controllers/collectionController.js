"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLast7DaysCollectionData = exports.getCollectionData = exports.Statistics = exports.createCollection = void 0;
const { catchAsyncErrors } = require("../middleware/catchAsyncErrors");
const collectionModel = require("../models/collectionModel");
const userModel = require("../models/userModels");
const adminModel = require("../models/adminModel");
const moment_1 = __importDefault(require("moment"));
const createCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invoice_id, customerInfo, cashierInfo, date, amount, notes } = req.body;
        if (!cashierInfo || !cashierInfo.email) {
            return res.status(400).json({ error: "Cashier email is required" });
        }
        const { name, address, phone, email, _id } = customerInfo;
        const collection = new collectionModel({
            invoice_id,
            customerInfo: { name, address, phone, email },
            cashierInfo,
            date,
            amount,
            notes,
            customer_id: _id,
        });
        // Save the collection record to the database
        yield collection.save();
        const isUser = yield userModel.findOne({ email: cashierInfo.email });
        const isAdmin = yield adminModel.findOne({ email: cashierInfo.email });
        // Modify the user/admin model and collection accordingly
        if (isUser) {
            isUser.collection.push(collection._id);
            collection.ifcreatedByUser = isUser._id;
            yield isUser.save();
        }
        if (isAdmin) {
            isAdmin.collection.push(collection._id);
            collection.ifCreatedByAdmin = isAdmin._id;
            yield isAdmin.save();
        }
        yield collection.save();
        res
            .status(201)
            .json({ message: "Collection created successfully", collection });
    }
    catch (error) {
        console.error("Error creating collection:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createCollection = createCollection;
exports.getCollections = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collections = yield collectionModel.find();
        res.json(collections);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
// Function to get a single collection record by ID
exports.getCollectionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield collectionModel.findOne({
            invoice_id: req.params.id,
        });
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        res.json(collection);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
// Function to update a collection record by ID
exports.updateCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield collectionModel.findOne({
            invoice_id: req.params.id,
        });
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        Object.assign(collection, req.body);
        yield collection.save();
        res.json(collection);
    }
    catch (error) {
        res.status(400).json({ message: error });
    }
});
exports.deleteCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield collectionModel.findOneAndDelete({
            invoice_id: req.params.id,
        });
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        res.json({ message: "Collection deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting collection:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.collectionsOfUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collections = yield userModel
            .findOne({ _id: req.Userid })
            .populate("collection");
        res.json(collections.collection);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
const Statistics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.Userid; // Assuming you're using JWT for authentication
        // Total number of customers
        const totalCustomers = yield userModel.countDocuments();
        // Todays collections
        const todayStart = (0, moment_1.default)().startOf("day");
        const todayEnd = (0, moment_1.default)().endOf("day");
        const todayCollections = yield collectionModel.find({
            createdAt: { $gte: todayStart, $lte: todayEnd },
        });
        // Total collections made today
        const todayTotalAmount = yield collectionModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: todayStart, $lte: todayEnd },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);
        // Weekly collections
        const weekStart = (0, moment_1.default)().startOf("week");
        const weekEnd = (0, moment_1.default)().endOf("week");
        const weeklyCollections = yield collectionModel.find({
            createdAt: { $gte: weekStart, $lte: weekEnd },
        });
        // Total collections made this week
        const weeklyTotalAmount = yield collectionModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: weekStart, $lte: weekEnd },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);
        // Monthly collections
        const monthStart = (0, moment_1.default)().startOf("month");
        const monthEnd = (0, moment_1.default)().endOf("month");
        const monthlyCollections = yield collectionModel.find({
            createdAt: { $gte: monthStart, $lte: monthEnd },
        });
        // Total collections made this month
        const monthlyTotalAmount = yield collectionModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthStart, $lte: monthEnd },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);
        // Total collections made by the user
        const userCollections = yield collectionModel.find({
            createdByUser: userId,
        });
        // Calculate total collections
        const totalCollections = yield collectionModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);
        res.status(200).json({
            totalCustomers,
            todayCollections: todayCollections.length,
            todayTotalAmount: todayTotalAmount.length > 0 ? todayTotalAmount[0].totalAmount : 0,
            weeklyCollections: weeklyCollections.length,
            weeklyTotalAmount: weeklyTotalAmount.length > 0 ? weeklyTotalAmount[0].totalAmount : 0,
            monthlyCollections: monthlyCollections.length,
            monthlyTotalAmount: monthlyTotalAmount.length > 0 ? monthlyTotalAmount[0].totalAmount : 0,
            userCollections: userCollections.length,
            totalCollections: totalCollections.length > 0 ? totalCollections[0].totalAmount : 0,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.Statistics = Statistics;
const getCollectionData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.Userid; // Assuming you're using JWT for authentication
        // Calculate the start date for 30 days ago
        const startDate = (0, moment_1.default)().subtract(30, "days").startOf("day");
        const dates = [];
        const totals = [];
        // Loop through each day of the last 30 days
        for (let i = 0; i < 31; i++) {
            // Changed loop to iterate over 31 days to include today
            const currentDate = (0, moment_1.default)(startDate).add(i, "days").format("MM/DD/YYYY"); // Format adjusted to match database
            // Find collections for the current day and user
            const foundCollections = yield collectionModel.find({
                ifcreatedByUser: userId,
                date: currentDate,
            });
            // Calculate total money collected for the day
            let totalMoneyCollected = 0;
            foundCollections.forEach((collection) => {
                totalMoneyCollected += collection.amount;
            });
            // Push the formatted date and total to arrays
            dates.push(currentDate);
            totals.push(totalMoneyCollected);
        }
        const response = {
            date: dates,
            total: totals,
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getCollectionData = getCollectionData;
const getLast7DaysCollectionData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.Userid; // Assuming you're using JWT for authentication
        // Calculate the start date for 7 days ago
        const startDate = (0, moment_1.default)().subtract(7, "days").startOf("day");
        const dates = [];
        const totals = [];
        // Loop through each day of the last 7 days
        for (let i = 0; i < 8; i++) {
            // Changed loop to iterate over 7 days to include today
            const currentDate = (0, moment_1.default)(startDate).add(i, "days").format("MM/DD/YYYY"); // Format adjusted to match database
            // Find collections for the current day and user
            const foundCollections = yield collectionModel.find({
                ifcreatedByUser: userId,
                date: currentDate,
            });
            // Calculate total money collected for the day
            let totalMoneyCollected = 0;
            foundCollections.forEach((collection) => {
                totalMoneyCollected += collection.amount;
            });
            // Push the formatted date and total to arrays
            dates.push(currentDate);
            totals.push(totalMoneyCollected);
        }
        const response = {
            date: dates,
            total: totals,
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getLast7DaysCollectionData = getLast7DaysCollectionData;
exports.getCustomerStatistics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch collections for the customer
        const collections = yield collectionModel.find({
            customer_id: req.customerId,
        });
        // Calculate dates for the last 30 days, last 7 days, and today
        const today = (0, moment_1.default)();
        const last30Days = (0, moment_1.default)().subtract(30, 'days');
        const last7Days = (0, moment_1.default)().subtract(7, 'days');
        // Filter collections for the last 30 days
        const collectionsLast30Days = collections.filter((collection) => (0, moment_1.default)(collection.date, 'MM/DD/YYYY').isBetween(last30Days, today));
        // Filter collections for the last 7 days
        const collectionsLast7Days = collections.filter((collection) => (0, moment_1.default)(collection.date, 'MM/DD/YYYY').isBetween(last7Days, today));
        // Filter collections for today
        const collectionsToday = collections.filter((collection) => (0, moment_1.default)(collection.date, 'MM/DD/YYYY').isSame(today, 'day'));
        // Calculate total amount for the last 30 days
        const totalAmountLast30Days = collectionsLast30Days.reduce((total, collection) => {
            return total + collection.amount;
        }, 0);
        // Calculate total amount deposited for the last 7 days
        const totalAmountLast7Days = collectionsLast7Days.reduce((total, collection) => {
            return total + collection.amount;
        }, 0);
        // Calculate total amount deposited today
        const totalAmountToday = collectionsToday.reduce((total, collection) => {
            return total + collection.amount;
        }, 0);
        // Prepare response object
        const statistics = {
            totalAmountLast30Days,
            totalAmountLast7Days,
            totalAmountToday
        };
        res.json(statistics);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.getCustomerCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collections = yield collectionModel.find({
            customer_id: req.customerId,
        });
        res.json(collections);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
