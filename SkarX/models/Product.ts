/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Schema, model, models, LeanDocument, Callback } from "mongoose";
import db from "../utils/db";
// // 1. Create an interface representing a document in MongoDB.
export interface Product {
    userId?: string;
    _id?: string;
    name?: string;
    category?: string;
    price?: number;
    stock?: number;
    description?: string;
    brand?: string;
}

// // 2. Create a Schema corresponding to the document interface.

const productSchema = new Schema<Product>(
    {
        userId: {
            type: String,
            ref: "User",
            required: true,
            index: true,
        },
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        stock: {
            type: Number,
            required: true,
        },
        description: { type: String, required: true },
        brand: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

// // 3. Create a Model.
const ProductModel =
    models == null
        ? model<Product>("Product", productSchema)
        : models.Product == null
        ? model<Product>("Product", productSchema)
        : models.Product;

// run().catch((err) => console.log(err));

// // 4. Connect to MongoDB
// async function run(): Promise<void> {
//     await connect("mongodb://localhost:27017/dukkan");
// }

export async function getProductsWithFilters(
    filters: Callback<any[]> | undefined,
    order: any,
    pageSize: number,
    page: number
): Promise<any[] | LeanDocument<any>[] | null> {
    await db.connect();
    let products = await ProductModel.find(filters)
        .sort(order)
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    //.lean();
    if (products == null) {
        await db.disconnect();
        return null;
    }
    products = products.map(db.convertDocToObj);
    await db.disconnect();
    //products = products.map(db.convertDocToObj);
    return products;
}

export async function getProductsByUser(
    userId: string | undefined
): Promise<Product[] | null> {
    await db.connect();
    const products = await ProductModel.find({ userId: userId });
    await db.disconnect();
    return products;
}

export async function checkProductSeller(
    userId: string | undefined,
    productId: string | string[]
): Promise<boolean | null> {
    await db.connect();
    const product = await getProductById(productId);
    await db.disconnect();
    if (product == null || product.userId == null) return null;
    if (product.userId.toString() !== userId) return false;
    return true;
}

export async function setProduct(
    product: Product,
    productId: string | string[]
): Promise<boolean> {
    await db.connect();
    if (product == null) {
        await db.disconnect();
        return false;
    }
    const retProduct = await ProductModel.findOneAndUpdate(
        { _id: productId },
        {
            $set: {
                name: product.name,
                price: product.price,
                category: product.category || "All",
                brand: product.brand,
                stock: product.stock,
                description: product.description,
                userId: product.userId,
            },
        },
        { returnOriginal: false }
    );
    await db.disconnect();
    if (retProduct == null) return false;
    return true;
}

export async function getProducts(): Promise<Product[]> {
    await db.connect();
    const products = await ProductModel.find({}).limit(9);
    await db.disconnect();
    return products;
}

export async function setStock(_id: string, newStock: number): Promise<void> {
    await db.connect();
    await ProductModel.findOneAndUpdate(
        { _id: _id },
        { $set: { stock: newStock } },
        { returnOriginal: false }
    );
    await db.disconnect();
}

export async function getProductsForAdmin(): Promise<Product[]> {
    await db.connect();
    const products = await ProductModel.find({});
    await db.disconnect();
    return products;
}

export async function getCount(
    filters: Callback<number> | undefined
): Promise<number> {
    await db.connect();
    const count = await ProductModel.countDocuments(filters);
    await db.disconnect();
    return count;
}

export async function getCategories(): Promise<string[] | null> {
    await db.connect();
    const categories = await ProductModel.find().distinct("category");
    await db.disconnect();
    return categories;
}

export async function getBrands(): Promise<string[] | null> {
    await db.connect();
    const categories = await ProductModel.find().distinct("brand");
    await db.disconnect();
    return categories;
}

export async function getProductById(
    _id: string | string[]
): Promise<Product | null> {
    await db.connect();
    let product = await ProductModel.findOne({ _id }).lean();
    if (product == null) {
        await db.disconnect();
        return null;
    }
    product = db.convertDocToObj(product);
    await db.disconnect();
    return product;
}

export async function addProduct(product: Product): Promise<Product | null> {
    await db.connect();
    const doc = new ProductModel({
        userId: product.userId,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description,
        brand: product.brand,
    });
    const retProduct = await doc.save();
    await db.disconnect();
    return retProduct;
}


export async function removeProductById(
    _id: string | string[]
): Promise<boolean> {
    await db.connect();
    const product = await ProductModel.findById(_id);
    if (product) {
        await product.remove();
        await db.disconnect();
        return true;
    } else {
        await db.disconnect();
        return false;
    }
}
