import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import CategoryModel from './models/category.model.js';
import SubCategoryModel from './models/subCategory.model.js';
import ProductModel from './models/product.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
};

const deleteCategory = async (category) => {
    console.log(`\nDeleting Category: ${category.name} (ID: ${category._id})`);

    // 1. Delete Products linked to this category
    const products = await ProductModel.find({ category: category._id });
    const productResult = await ProductModel.deleteMany({ category: category._id });
    console.log(` -> Deleted ${productResult.deletedCount} products (${products.length} found).`);

    // 2. Delete SubCategories linked to this category
    const subCategories = await SubCategoryModel.find({ category: category._id });
    const subCatResult = await SubCategoryModel.deleteMany({ category: category._id });
    console.log(` -> Deleted ${subCatResult.deletedCount} subcategories (${subCategories.length} found).`);

    // 3. Delete the Category itself
    await CategoryModel.deleteOne({ _id: category._id });
    console.log(` -> Deleted Category: ${category.name}`);

    console.log("\nDeletion Complete.");
};

const main = async () => {
    try {
        await connectDB();

        console.log("\nFetching Categories...");
        const categories = await CategoryModel.find({}).sort({ name: 1 });

        if (categories.length === 0) {
            console.log("No categories found.");
            process.exit(0);
        }

        console.log("\n--- Available Categories ---");
        categories.forEach((cat, index) => {
            console.log(`${index + 1}. ${cat.name}`);
        });
        console.log("----------------------------");

        rl.question('\nEnter the number of the category to DELETE (or "q" to quit): ', async (answer) => {
            if (answer.toLowerCase() === 'q') {
                console.log("Exiting...");
                process.exit(0);
            }

            const index = parseInt(answer) - 1;

            if (isNaN(index) || index < 0 || index >= categories.length) {
                console.error("Invalid selection. Please run again.");
                process.exit(1);
            }

            const selectedCategory = categories[index];

            rl.question(`\nWARNING: Are you sure you want to delete "${selectedCategory.name}" and ALL its subcategories/products? (yes/no): `, async (confirm) => {
                if (confirm.toLowerCase() === 'yes') {
                    await deleteCategory(selectedCategory);
                } else {
                    console.log("Deletion cancelled.");
                }
                process.exit(0);
            });
        });

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

main();
