import mongoose from 'mongoose';
import CategoryModel from '../models/category.model.js';
import SubCategoryModel from '../models/subCategory.model.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from server/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Paths to your local images (Adjusted based on your screenshot)
const CLIENT_IMAGE_ROOT = path.resolve(__dirname, '../../Image');
const CATEGORY_DIR = path.join(CLIENT_IMAGE_ROOT, 'category');
const SUBCATEGORY_DIR = path.join(CLIENT_IMAGE_ROOT, 'sub category');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLODINARY_CLOUD_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET_KEY
});

// Helper: Upload file to Cloudinary
const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "ApniMart/AppSetup"
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Failed to upload ${filePath}:`, error.message);
        return null;
    }
};

const seedData = async () => {
    try {
        // 1. Connect to DB
        if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB.");

        // 2. Validate Directories
        if (!fs.existsSync(CATEGORY_DIR)) throw new Error(`Category directory not found at: ${CATEGORY_DIR}`);
        if (!fs.existsSync(SUBCATEGORY_DIR)) throw new Error(`Subcategory directory not found at: ${SUBCATEGORY_DIR}`);

        // 3. Process Categories
        const categoryFiles = fs.readdirSync(CATEGORY_DIR).filter(file => !file.startsWith('.'));
        console.log(`Found ${categoryFiles.length} category files.`);

        for (const catFile of categoryFiles) {
            const catNameWithExt = catFile;
            // Remove extension for the Name (e.g. "Dairy.png" -> "Dairy")
            const catName = path.parse(catFile).name; 
            const catPath = path.join(CATEGORY_DIR, catFile);

            console.log(`\nProcessing Category: ${catName}...`);

            // Check if exists
            let category = await CategoryModel.findOne({ name: catName });
            if (category) {
                console.log(` - Category "${catName}" already exists. Skipping creation/upload.`);
            } else {
                // Upload Image
                console.log(` - Uploading image...`);
                const imageUrl = await uploadToCloudinary(catPath);
                if (!imageUrl) continue;

                // Create DB Entry
                category = new CategoryModel({
                    name: catName,
                    image: imageUrl
                });
                await category.save();
                console.log(` - Created Category: ${catName}`);
            }

            // 4. Process Subcategories for this Category
            // Expecting a folder in 'sub category' with the exact same name as the category
            const subCatFolderPath = path.join(SUBCATEGORY_DIR, catName);
            
            if (fs.existsSync(subCatFolderPath) && fs.lstatSync(subCatFolderPath).isDirectory()) {
                const subCatFiles = fs.readdirSync(subCatFolderPath).filter(file => !file.startsWith('.'));
                console.log(`   > Found ${subCatFiles.length} subcategories for "${catName}".`);

                for (const subFile of subCatFiles) {
                    const subName = path.parse(subFile).name;
                    const subPath = path.join(subCatFolderPath, subFile);

                    // Check if exists
                    const existingSub = await SubCategoryModel.findOne({ name: subName });
                    if (existingSub) {
                        // Ensure it's linked to this category
                        if (!existingSub.category.includes(category._id)) {
                             existingSub.category.push(category._id);
                             await existingSub.save();
                             console.log(`     - Linked existing SubCategory "${subName}" to "${catName}"`);
                        } else {
                             console.log(`     - SubCategory "${subName}" already exists and linked. Skipping.`);
                        }
                    } else {
                        // Upload
                        const subImageUrl = await uploadToCloudinary(subPath);
                        if (subImageUrl) {
                            const newSub = new SubCategoryModel({
                                name: subName,
                                image: subImageUrl,
                                category: [category._id]
                            });
                            await newSub.save();
                            console.log(`     - Created SubCategory: ${subName}`);
                        }
                    }
                }
            } else {
                 console.log(`   > No subcategory folder found for "${catName}" (Expected at: ${subCatFolderPath})`);
            }
        }

        console.log("\n-----------------------------------------");
        console.log("Seeding Completed Successfully!");
        console.log("-----------------------------------------");

    } catch (error) {
        console.error("\nERROR:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

seedData();
