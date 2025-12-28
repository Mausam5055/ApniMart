import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from './models/product.model.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
};

const seedPrices = async () => {
    await connectDB();
    
    try {
        const products = await ProductModel.find({});
        console.log(`Found ${products.length} products to update.`);

        for (const product of products) {
            // Price between 50 and 1000
            const randomPrice = Math.floor(Math.random() * (1000 - 50 + 1)) + 50;
            // Discount between 0 and 20
            const randomDiscount = Math.floor(Math.random() * 21); 

            product.price = randomPrice;
            product.discount = randomDiscount;
            
            await product.save();
        }
        console.log("All products updated successfully.");
    } catch (error) {
        console.error("Error updating products:", error);
    } finally {
        process.exit(0);
    }
};

seedPrices();
