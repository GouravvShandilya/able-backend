import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "invoice"
  }]
});

const customermodel = mongoose.model("customer", customerSchema);

module.exports = customermodel;
