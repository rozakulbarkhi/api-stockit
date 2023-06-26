import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    unique: true,
  },
  image: {
    type: String,
    required: [true, "Product image is required"],
  },
  stock: {
    type: Number,
    required: [true, "Product stock is required"],
    min: [1, "Stock can't be less than 1"],
  },
  purchasePrice: {
    type: Number,
    required: [true, "Product purchase price is required"],
    min: [1, "Purchase price can't be less than 1"],
  },
  sellingPrice: {
    type: Number,
    required: [true, "Product selling price is required"],
    min: [1, "Selling price can't be less than 1"],
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
