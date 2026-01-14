import mongoose, { Schema, Document, Model } from "mongoose";

interface ICart extends Document
{
    pid: string;
    Picture: string;
    ProdName: string;
    Rate: number;
    Qty: number;
    TotalCost: number;
    email: string;
}


const cartSchema: Schema<ICart> = new Schema<ICart>(
    {
        pid: {
            type: String,
            required: true,
        },
        Picture: {
            type: String,
            required: true,
        },
        ProdName: {
            type: String,
            required: true,
        },
        Rate: {
            type: Number,
            required: true,
        },
        Qty: {
            type: Number,
            required: true,
        },
        TotalCost: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    { versionKey: false }
);


const CartModel: Model<ICart> = mongoose.model<ICart>("cart", cartSchema, "cart");

export default CartModel;
