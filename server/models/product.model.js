import mongoose from "mongoose";
//const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    trim: true,
    required: "Category is required",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
},
{
  collection: 'product'
});
ProductSchema.path("price").validate(function (v) {
  if (this.price < 0) {
    this.invalidate("price", "Price must be positive numbers.");
  }
}, null);
ProductSchema.path("quantity").validate(function (v) {
  if (this.quantity < 0) {
    this.invalidate("quantity", "Quantity must be positive numbers.");
  }
}, null);
export default mongoose.model("Product", ProductSchema);
