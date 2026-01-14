import mongoose, { Schema, Document, Model } from "mongoose";
import { Request } from "express";

interface IProduct extends Document
{
    catid: mongoose.Types.ObjectId;
    subcatid: mongoose.Types.ObjectId;
    Name: string;
    Rate: number;
    Discount: number;
    Stock: number;
    Description: string;
    Picture?: string;
    ExtraPicture?: string[];
    Addedon: Date;
}


const productSchema: Schema<IProduct> = new Schema<IProduct>(
    {
        catid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },
        subcatid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subcategory",
            required: true,
        },
        Name: {
            type: String,
            unique: true,
            required: true,
        },
        Rate: {
            type: Number,
            required: true,
        },
        Discount: {
            type: Number,
            default: 0,
        },
        Stock: {
            type: Number,
            required: true,
        },
        Description: {
            type: String,
            required: true,
        },
        Picture: {
            type: String,
        },
        ExtraPicture: {
            type: [String],
        },
        Addedon: {
            type: Date,
            default: Date.now,
        },
    },
    { versionKey: false }
);


const productmodel: Model<IProduct> = mongoose.model<IProduct>("product", productSchema, "product");

export default productmodel;