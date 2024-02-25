import Product from "../models/product.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
const create = async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    return res.status(200).json({
      message: 'Product "' + product.name + '" added.',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const list = async (req, res) => {
  try {
    let filter = null;

    if (req.query && req.query.name) {
      let s = req.query.name.match(/\[(.*)\]/);
      // console.log(s);
      if (s) {
        let keyword = s[1];
        console.log("Keyword: " + keyword);
        filter = { name: { $regex: keyword } };
      }
    }

    let products = await Product.find(filter).select(
      "name description price quantity category"
    );

    res.json(products);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const productByID = async (req, res, next, id) => {
  try {
    let product = await Product.findById(id);
    if (!product)
      return res.status("400").json({
        error: "Product not found",
      });
    req.profile = product;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve product",
    });
  }
};
const read = (req, res) => {
  return res.json(req.profile);
};
const update = async (req, res) => {
  try {
    let product = req.profile;
    product = extend(product, req.body);
    product.updated = Date.now();
    await product.save();
    res.json(product);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const remove = async (req, res) => {
  try {
    let product = req.profile;
    let deletedProduct = await product.deleteOne();
    res.json(deletedProduct);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const removeAll = async (req, res) => {
  try {
    await Product.deleteMany();
    return res.status(200).json({
      message: "All products are deleted.",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
export default { create, productByID, read, list, remove, removeAll, update };
