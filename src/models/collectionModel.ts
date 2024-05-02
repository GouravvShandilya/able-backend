import mongoose from "mongoose";

const collectionModel = new mongoose.Schema({
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
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

const collectionmodel = mongoose.model("collection", collectionModel);

module.exports = collectionmodel;
