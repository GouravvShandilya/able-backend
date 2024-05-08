"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAuthenticate_1 = require("../middleware/isAuthenticate");
const isCustomer_1 = require("../middleware/isCustomer");
const express = require("express");
const router = express.Router();
const { createCollection, getCollections, getCollectionById, updateCollection, deleteCollection, collectionsOfUser, Statistics, getCollectionData, getLast7DaysCollectionData, getCustomerStatistics, getCustomerCollection } = require("../controllers/collectionController");
router.post("/createCollection", createCollection);
router.get("/collections", getCollections);
router.get("/collections/:id", getCollectionById);
router.put("/collections/:id", updateCollection);
router.delete("/collections/:id", deleteCollection);
// for user
router.get("/collectionsOfUser", isAuthenticate_1.isAuthenticated, collectionsOfUser);
router.get("/getUserStatistics", isAuthenticate_1.isAuthenticated, Statistics);
router.get("/getCollectionData", isAuthenticate_1.isAuthenticated, getCollectionData);
router.get("/getLast7DaysCollectionData", isAuthenticate_1.isAuthenticated, getLast7DaysCollectionData);
//for custommers
router.get("/getCustomerStatistics", isCustomer_1.isCustomer, getCustomerStatistics);
router.get("/getCustomerCollection", isCustomer_1.isCustomer, getCustomerCollection);
module.exports = router;
