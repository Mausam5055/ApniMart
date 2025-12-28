import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import ProductModel from './models/product.model.js';
import CategoryModel from './models/category.model.js';
import SubCategoryModel from './models/subCategory.model.js';

dotenv.config();

const PRODUCT_DIR = path.resolve('../product'); // Adjust if needed

// Configure Cloudinary
cloudinary.config({
    cloud_name : process.env.CLODINARY_CLOUD_NAME,
    api_key : process.env.CLODINARY_API_KEY,
    api_secret : process.env.CLODINARY_API_SECRET_KEY
});

// Helper: Upload image directly from path
const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "binkeyit/products"
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Error uploading ${filePath}:`, error);
        return null;
    }
};

// Helper: Extract text from RTF (Simple Regex based)
const extractTextFromRtf = (rtfContent) => {
    // Remove groups
    let text = rtfContent.replace(/(\{[^}]*\})/g, "");
    // Remove commands
    text = text.replace(/\\[a-z0-9]+/g, "");
    // Remove generic braces
    text = text.replace(/[{}]/g, "");
    // Trim whitespace
    return text.trim();
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
};

const processProduct = async (productPath, categoryId, subCategoryId) => {
    const dirName = path.basename(productPath);
    console.log(`Processing Product: ${dirName}`);

    const files = fs.readdirSync(productPath);
    let description = "";
    let price = 0;
    let discount = 0;
    const images = [];
    const rtfFile = files.find(f => f.endsWith('.rtf'));

    if (rtfFile) {
        const rtfContent = fs.readFileSync(path.join(productPath, rtfFile), 'utf-8');
        const rawText = extractTextFromRtf(rtfContent);
        // Attempt to parse Key: Value if possible, or just use as description
        // For now, mapping raw text to description. 
        // TODO: Enhance parsing if structure is consistent (e.g. Price: 100)
        description = rawText; 
    }

    // Upload images
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
    for (const img of imageFiles) {
        const url = await uploadImage(path.join(productPath, img));
        if (url) images.push(url);
    }

    // Create Product
    const product = new ProductModel({
        name: dirName,
        category: [categoryId],
        subCategory: [subCategoryId],
        description: description,
        price: price, // Placeholder until we parse it
        discount: discount,
        image: images,
        publish: true
    });

    await product.save();
    console.log(`Saved Product: ${dirName}`);
};

const processSubCategory = async (subCatPath, categoryId) => {
    const subCatName = path.basename(subCatPath);
    console.log(`Processing SubCategory: ${subCatName}`);

    // Check if SubCategory exists or create
    let subCat = await SubCategoryModel.findOne({ name: subCatName });
    if (!subCat) {
        subCat = new SubCategoryModel({
            name: subCatName,
            category: [categoryId]
        });
        await subCat.save();
    }

    // Iterate items (could be Products directly or further folders?)
    // Assuming structure: Category -> SubCategory -> ProductFolder
    const items = fs.readdirSync(subCatPath, { withFileTypes: true });
    
    for (const item of items) {
        if (item.isDirectory()) {
            await processProduct(path.join(subCatPath, item.name), categoryId, subCat._id);
        }
    }
};

const processCategory = async (catPath) => {
    const catName = path.basename(catPath);
    console.log(`Processing Category: ${catName}`);

    let category = await CategoryModel.findOne({ name: catName });
    if (!category) {
        category = new CategoryModel({
             name: catName,
             // image: ... // Could extract a representative image if needed
        });
        await category.save();
    }

    const items = fs.readdirSync(catPath, { withFileTypes: true });
    for (const item of items) {
        if (item.isDirectory()) {
            await processSubCategory(path.join(catPath, item.name), category._id);
        }
    }
};

const seed = async () => {
    await connectDB();
    
    if (!fs.existsSync(PRODUCT_DIR)) {
        console.error(`Product directory not found at ${PRODUCT_DIR}`);
        return;
    }

    const categories = fs.readdirSync(PRODUCT_DIR, { withFileTypes: true });

    for (const cat of categories) {
        if (cat.isDirectory()) {
            await processCategory(path.join(PRODUCT_DIR, cat.name));
        }
    }

    console.log("Seeding Complete");
    process.exit(0);
};

seed();
