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
Object.defineProperty(exports, "__esModule", { value: true });
exports.allCollection = exports.last30DaysCollectionTotal = exports.monthlyRevenueTotal = exports.monthlyCollection = exports.weeklyCollectionTotal = exports.weeklyEachDayCollectionTotal = exports.weeklyCollection = exports.dayCollectionTotal = exports.dayCollection = exports.deleteUser = exports.allUser = exports.finduserbyname = exports.finduserbyarea = exports.createUser = exports.currentAdmin = exports.signoutAdmin = exports.updateAdmin = exports.signupAdmin = exports.loginAdmin = exports.adminHomepage = void 0;
const { catchAsyncErrors } = require("../middleware/catchAsyncErrors");
const adminmodel = require("../models/adminModel");
const UserModel = require("../models/userModels");
const collectionModel = require("../models/collectionModel");
const errorHandler_1 = require("../utils/errorHandler");
const sendToken_1 = require("../utils/sendToken");
exports.adminHomepage = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: " Admin homepage" });
}));
exports.loginAdmin = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield adminmodel.findOne({ email: req.body.email });
    if (!admin)
        return next(new errorHandler_1.errorHandler("User Not Found", 404));
    const isMatch = admin.compareAdminPassword(req.body.password);
    if (!isMatch)
        return next(new errorHandler_1.errorHandler("Wrong Crediendials", 404));
    (0, sendToken_1.sendtoken)(admin, 201, res);
}));
exports.signupAdmin = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield new adminmodel(req.body).save();
    (0, sendToken_1.sendtoken)(admin, 201, res);
}));
exports.updateAdmin = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.params.adminId;
    const updates = req.body;
    // Check if there are no updates sent
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            status: "fail",
            message: "No updates provided",
        });
    }
    try {
        const admin = yield adminmodel.findByIdAndUpdate(adminId, updates, {
            new: true, // Return the modified document rather than the original
            runValidators: true, // Run validation on update
        });
        if (!admin) {
            return res.status(404).json({
                status: "fail",
                message: "Admin not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: {
                admin,
            },
        });
    }
    catch (err) {
        return next(err);
    }
}));
exports.signoutAdmin = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    res.json({ message: "sign out successfully" });
}));
exports.currentAdmin = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield adminmodel.findOne({ _id: req.id });
    res.json({ admin: currentUser });
}));
exports.createUser = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create the user document
        const createdUser = yield new UserModel(req.body).save();
        // Send response
        res.json({ message: "User created", user: createdUser });
    }
    catch (error) {
        // Handle errors
        res.json({ err: error });
    }
}));
exports.finduserbyarea = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const founduser = yield UserModel.find({ area: req.query.area });
    if (founduser.length == 0)
        return res.json({
            message: "no user found",
        });
    else {
        res.json({
            users: founduser,
        });
    }
}));
exports.finduserbyname = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const foundedUser = yield UserModel.find({ full_name: req.query.name });
    res.json({ users: foundedUser });
}));
exports.allUser = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const foundedUser = yield UserModel.find({}).populate("revenue");
    res.json({ users: foundedUser });
}));
exports.deleteUser = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    // Check if the user exists
    const user = yield UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    // Delete the user
    yield UserModel.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
}));
exports.dayCollection = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date();
        const todayDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        const foundCollection = yield collectionModel.find({
            moneyCollectionDate: todayDate,
        });
        res.json({
            collection: foundCollection,
        });
    }
    catch (error) {
        req.json({ error });
    }
}));
exports.dayCollectionTotal = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date();
        // Format today's date as "dd/mm/yyyy"
        const todayDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        // Find collections for the current day
        const foundCollection = yield collectionModel.find({
            moneyCollectionDate: todayDate,
        });
        // Calculate total money collected for the day
        let totalMoneyCollected = 0;
        foundCollection.forEach((collection) => {
            totalMoneyCollected += collection.moneyCollection;
        });
        res.json({
            TotalDayCollection: totalMoneyCollected,
        });
    }
    catch (error) {
        res.json({ error });
    }
}));
exports.weeklyCollection = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date();
        // Calculate the start date for the week (7 days ago)
        const startDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
        // Format start date as "dd/mm/yyyy"
        const startDateFormatted = startDate.getDate() +
            "/" +
            startDate.getMonth() +
            "/" +
            startDate.getFullYear();
        // Format today's date as "dd/mm/yyyy"
        const todayDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        // Find collections within the last 7 days
        const foundCollection = yield collectionModel.find({
            moneyCollectionDate: {
                $gte: startDateFormatted, // Greater than or equal to start date
                $lte: todayDate, // Less than or equal to today's date
            },
        });
        res.json({
            collection: foundCollection,
        });
    }
    catch (error) {
        res.json({ error });
    }
}));
exports.weeklyEachDayCollectionTotal = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date();
        // Calculate the start date for the week (7 days ago)
        const startDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
        const dayTotals = [];
        // Loop through each day of the last 7 days
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            const formattedDate = currentDate.getDate() +
                "/" +
                currentDate.getMonth() +
                "/" +
                currentDate.getFullYear();
            // Find collections for the current day
            const foundCollection = yield collectionModel.find({
                moneyCollectionDate: formattedDate,
            });
            // Calculate total money collected for the day
            let totalMoneyCollected = 0;
            foundCollection.forEach((collection) => {
                totalMoneyCollected += collection.moneyCollection;
            });
            // Store total for the current day in an object
            const dayTotal = {
                date: formattedDate,
                total: totalMoneyCollected,
            };
            // Push the day total to the array
            dayTotals.push(dayTotal);
        }
        res.json({
            weeklyDayTotals: dayTotals,
        });
    }
    catch (error) {
        res.json({ error });
    }
}));
exports.weeklyCollectionTotal = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date();
        // Calculate the start date for the week (7 days ago)
        const startDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
        // Format start date as "dd/mm/yyyy"
        const startDateFormatted = startDate.getDate() +
            "/" +
            startDate.getMonth() +
            "/" +
            startDate.getFullYear();
        // Format today's date as "dd/mm/yyyy"
        const todayDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        // Find collections within the last 7 days
        const foundCollection = yield collectionModel.find({
            moneyCollectionDate: {
                $gte: startDateFormatted, // Greater than or equal to start date
                $lte: todayDate, // Less than or equal to today's date
            },
        });
        // Calculate total money collected in the last 7 days
        let totalMoneyCollected = 0;
        foundCollection.forEach((collection) => {
            totalMoneyCollected += collection.moneyCollection;
        });
        res.json({
            TotalWeeklyCollection: totalMoneyCollected,
        });
    }
    catch (error) {
        res.json({ error });
    }
}));
exports.monthlyCollection = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date();
        // Calculate the start date for the month (1st day of the current month)
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        // Format start date as "dd/mm/yyyy"
        const startDateFormatted = startDate.getDate() +
            "/" +
            startDate.getMonth() +
            "/" +
            startDate.getFullYear();
        // Format today's date as "dd/mm/yyyy"
        const todayDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        // Find collections within the current month
        const foundCollection = yield collectionModel.find({
            moneyCollectionDate: {
                $gte: startDateFormatted, // Greater than or equal to start date
                $lte: todayDate, // Less than or equal to today's date
            },
        });
        res.json({
            collection: foundCollection,
        });
    }
    catch (error) {
        res.json({ error });
    }
}));
exports.monthlyRevenueTotal = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date();
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const startDateFormatted = startDate.getDate() +
            "/" +
            startDate.getMonth() +
            "/" +
            startDate.getFullYear();
        const todayDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        // Find collections within the current month
        const foundCollection = yield collectionModel.find({
            moneyCollectionDate: {
                $gte: startDateFormatted,
                $lte: todayDate,
            },
        });
        let totalRevenue = 0;
        foundCollection.forEach((collection) => {
            totalRevenue += collection.moneyCollection;
        });
        res.json({
            TotalMonthlyRevenue: totalRevenue,
        });
    }
    catch (error) {
        res.json({ error });
    }
}));
exports.last30DaysCollectionTotal = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date();
        // Calculate the start date for 30 days ago
        const startDate = new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);
        const dayTotals = [];
        // Loop through each day of the last 30 days
        for (let i = 0; i < 30; i++) {
            const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            const formattedDate = currentDate.getDate() +
                "/" +
                currentDate.getMonth() +
                "/" +
                currentDate.getFullYear();
            // Find collections for the current day
            const foundCollection = yield collectionModel.find({
                moneyCollectionDate: formattedDate,
            });
            // Calculate total money collected for the day
            let totalMoneyCollected = 0;
            foundCollection.forEach((collection) => {
                totalMoneyCollected += collection.moneyCollection;
            });
            // Store total for the current day in an object
            const dayTotal = {
                date: formattedDate,
                total: totalMoneyCollected,
            };
            // Push the day total to the array
            dayTotals.push(dayTotal);
        }
        res.json({
            last30DaysTotals: dayTotals,
        });
    }
    catch (error) {
        res.json({ error });
    }
}));
exports.allCollection = catchAsyncErrors((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find collections within the current month
        const foundCollection = yield collectionModel.find({});
        res.json({
            collection: foundCollection,
        });
    }
    catch (error) {
        res.json({ error });
    }
}));
