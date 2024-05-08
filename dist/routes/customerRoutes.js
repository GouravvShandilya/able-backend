"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isCustomer_1 = require("../middleware/isCustomer");
const express = require("express");
const router = express.Router();
const { customerHomepage, addCustomer, getAllCustomer, deleteCustomer, loginCustomer, currentCustomer,
//   signoutCustomer
 } = require("../controllers/customerController");
// import { isAuthenticated } from "../middleware/isAuthenticate";
// import { isAdmin } from "../middleware/isAdmin";
router.get("/", customerHomepage);
router.post("/addCustomer", addCustomer);
router.post("/customerLogin", loginCustomer);
router.get("/currentCustomer", isCustomer_1.isCustomer, currentCustomer);
// router.get("/customerSignout", signoutCustomer);
router.get("/getAllCustomer", getAllCustomer);
router.get("/deleteCustomer/:id", deleteCustomer);
module.exports = router;
