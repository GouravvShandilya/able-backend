"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const customerSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: "India"
    },
    zip_code: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    invoice_id: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "invoice"
        }]
});
const customermodel = mongoose_1.default.model("customer", customerSchema);
module.exports = customermodel;
