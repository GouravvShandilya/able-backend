"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const collectionModel = new mongoose_1.default.Schema({
    collectedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
    },
    moneyCollectionDate: {
        type: String,
    },
    moneyCollectionDay: {
        type: String,
    },
    moneyCollection: {
        type: Number,
    },
});
const collectionmodel = mongoose_1.default.model("collection", collectionModel);
module.exports = collectionmodel;
