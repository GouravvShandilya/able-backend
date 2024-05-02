const mongoose = require("mongoose");

exports.connectDatabase = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/test");
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};
