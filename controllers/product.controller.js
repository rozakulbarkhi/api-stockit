import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.model.js";
import path from "path";

const multerStorage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "uploads");
  // },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  // accept file jpg and png only
  const ext = path.extname(file.originalname);
  if (ext !== ".jpg" && ext !== ".png") {
    return cb(new Error("Only file with ext jpg and png are allowed"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 100000,
  },
});

export const uploadImage = upload.single("image");

export const getProducts = async (req, res, next) => {
  try {
    const product = await Product.find();

    if (product.length < 0) {
      return res.status(404).json({
        status: false,
        message: "No product found",
      });
    }

    res.status(200).json({
      status: true,
      results: product.length,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  const { name, stock, purchasePrice, sellingPrice } = req.body;
  const { path } = req.file;

  if (!name || !stock || !purchasePrice || !sellingPrice) {
    return res.status(400).send("All fields are required");
  }

  try {
    const cloudImage = await cloudinary.uploader.upload(path);

    const product = await Product.create({
      name,
      image: cloudImage.secure_url,
      stock,
      purchasePrice,
      sellingPrice,
    });

    res.status(201).json({
      status: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // upload image
    if (req.file) {
      const { path } = req.file;
      const cloudImage = await cloudinary.uploader.upload(path);

      product.image = cloudImage.secure_url;
      await product.save();
    }

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Product updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
