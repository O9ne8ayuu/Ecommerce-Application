import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import slugify from "slugify";
//create product 
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping, type ,sizes, stockStatus,imageUrl} = req.fields;
    const { photos } = req.files;

    //parse sizes if sent as json string 
    const parsedSizes = sizes ? sizes.split(',').map(s => s.trim()): [];

     // Validations
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !type:
        return res.status(400).send({ error: "Type is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case parsedSizes.length === 0:
        return res.status(400).send({ error: "Size is required" });
    }

    const product = new productModel({
      name,description,price,category,quantity,shipping,type,
      sizes:parsedSizes,
      imageUrl: imageUrl || "",
      slug:slugify(name),
      stockStatus:stockStatus || ( quantity > 0 ? "inStock" : "outOfStock"), imageUrl: imageUrl || "",
    });
    if (photos) {
  const photoArray = Array.isArray(photos) ? photos : [photos];

  photoArray.forEach((p) => {
    const data = fs.readFileSync(p.path);
    const contentType = p.mimetype || p.type || "image/jpeg";
    product.photos.push({ data, contentType });
  });
}
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log("Create Product Error:",error);
    res.status(500).send({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const index = Number.isInteger(parseInt(req.query.index)) ? parseInt(req.query.index) : 0;
    const product = await productModel.findById(req.params.pid).select("photos");
    if (!product || !product.photos || !product.photos.length){ return res.status(404).send({ message: "Image not found" });
  }

    const photo = product.photos[index] || product.photos[0];

    if(!photo || !photo.data || !photo.contentType){
    return res.status(404).send({message: "photo data missing or corrupt"});
    }
    res.set("content-type", photo.contentType);
    return res.status(200).send(photo.data);
  } catch (error) {
    console.error("Error in productController:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching photo",
      error: error.message,
    });
  }
};


export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping, type } = req.fields;
    const { photos } = req.files;

    const product = await productModel.findById(req.params.pid);
    if (!product) return res.status(404).send({ success: false, message: "Product not found" });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.quantity = quantity || product.quantity;
    product.shipping = shipping ?? product.shipping;
    product.type = type || product.type;
    product.slug = slugify(product.name);
    product.stockStatus = quantity > 0 ? "inStock" : "outOfStock";

    if (photos) {
      const newPhotos = Array.isArray(photos) ? photos : [photos];
      const photoObjects = newPhotos.map(file => ({
        data: fs.readFileSync(file.path),
        contentType: file.type,
      }));
      product.photos = [...product.photos, ...photoObjects];
    }

    await product.save();
    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// DELETE PRODUCT CONTROLLER
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid);
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};
// ======= GET DEAL PRODUCTS ==========
export const getDealProductsController = async (req, res) => {
  try {
    // You can filter deals however you define "deal" (e.g., by discount, tag, flag)
    const products = await productModel.find({ deal: true }).limit(10).select("-photos");

    res.status(200).send({
      success: true,
      message: "Deal Products Fetched Successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch deal products",
      error: error.message,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel.find({}).select("-photos").limit(20).sort({ createdAt: -1 }).populate("category");
      const productsWithPhoto = products.map((p) => {
      // Check if imageUrl exists (public static image)
      if (p.imageUrl) {
        return {
          ...p._doc,
          imageSource: p.imageUrl, 
        };
      }

      // Else, fallback to first uploaded photo
      const photo = p.photos?.[0];
      let base64Photo = null;

      if (photo?.data && photo?.contentType) {
        base64Photo = `data:${photo.contentType};base64,${photo.data.toString("base64")}`;
      }

      return {
        ...p._doc,
        imageSource: base64Photo || null, // fallback base64 or null
      };
    });

    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};
export const getsingleProductController = async (req, res) => {
  try {
    const product = await productModel.findOne({ slug: req.params.slug }).select("-photos").populate("category");
    res.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error: error.message,
    });
  }
};
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio, sizes } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    if(sizes?.length > 0) {
      args.sizes = {$in: sizes};
    }

    const products = await productModel.find(args).select("-photos");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while filtering products",
      error: error.message,
    });
  }
};
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({ success: true, total });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error counting products",
      error: error.message,
    });
  }
};
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photos")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in product list API",
      error: error.message,
    });
  }
};
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photos");

    res.json(results);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in search product API",
      error: error.message,
    });
  }
};
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photos")
      .limit(3)
      .populate("category");

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting related products",
      error: error.message,
    });
  }
};
export const productCategoryControler = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");

    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting category-wise product",
      error: error.message,
    });
  }
};
