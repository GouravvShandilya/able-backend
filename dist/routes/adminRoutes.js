"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const { adminHomepage, loginAdmin, signupAdmin, signoutAdmin, currentAdmin, createUser, finduserbyarea, finduserbyname, dayCollection, dayCollectionTotal, weeklyCollection, monthlyCollection, allCollection, weeklyCollectionTotal, monthlyRevenueTotal, weeklyEachDayCollectionTotal, last30DaysCollectionTotal, updateAdmin, allUser, deleteUser } = require("../controllers/adminController");
const isAdmin_1 = require("../middleware/isAdmin");
// admin routes
router.get("/", adminHomepage);
router.post("/login", loginAdmin);
router.post("/signup", signupAdmin);
router.get("/signout", isAdmin_1.isAdmin, signoutAdmin);
router.get("/currentAdmin", isAdmin_1.isAdmin, currentAdmin);
router.patch("/updateAdmins/:adminId", isAdmin_1.isAdmin, updateAdmin);
router.post("/createUser", isAdmin_1.isAdmin, createUser);
router.get("/finduserbyarea", isAdmin_1.isAdmin, finduserbyarea);
router.get("/finduserbyname", isAdmin_1.isAdmin, finduserbyname);
router.get("/allUser", isAdmin_1.isAdmin, allUser);
router.get("/deleteUser/:userId", isAdmin_1.isAdmin, deleteUser);
//collections details
router.get("/dayCollection", isAdmin_1.isAdmin, dayCollection);
router.get("/dayCollectionTotal", isAdmin_1.isAdmin, dayCollectionTotal);
router.get("/weeklyCollection", isAdmin_1.isAdmin, weeklyCollection);
router.get("/weeklyCollectionTotal", isAdmin_1.isAdmin, weeklyCollectionTotal);
router.get("/weeklyEachDayCollectionTotal", weeklyEachDayCollectionTotal);
router.get("/monthlyCollection", isAdmin_1.isAdmin, monthlyCollection);
router.get("/monthlyRevenueTotal", isAdmin_1.isAdmin, monthlyRevenueTotal);
router.get("/monthlyEachDayCollectionTotal", last30DaysCollectionTotal);
router.get("/allCollection", isAdmin_1.isAdmin, allCollection);
module.exports = router;
