const express = require("express");
const router = express.Router();
const {
    customerHomepage,
    addCustomer,
    getAllCustomer,
    deleteCustomer
} = require("../controllers/customerController");
// import { isAuthenticated } from "../middleware/isAuthenticate";
// import { isAdmin } from "../middleware/isAdmin";



router.get("/",customerHomepage)
router.post("/addCustomer",addCustomer)
router.get("/getAllCustomer",getAllCustomer)
router.get("/deleteCustomer/:id",deleteCustomer)






module.exports = router