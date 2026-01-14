import mongoose, { Schema, Document, Model } from "mongoose";

interface IOrder extends Document
{
    address: Record<string, any>;
    billamt: number;
    email: string;
    OrderDate: Date;
    PayMode: string;
    CardDetails?: Record<string, any>;
    OrderProducts: Record<string, any>[];
    status: string;
}


const orderSchema: Schema<IOrder> = new Schema<IOrder>(
    {
        address: {
            type: Object,
            required: true,
        },
        billamt: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        OrderDate: {
            type: Date,
            required: true,
        },
        PayMode: {
            type: String,
            required: true,
        },
        CardDetails: {
            type: Object,
        },
        OrderProducts: {
            type: [Object],
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    { versionKey: false }
);

const OrderModel: Model<IOrder> = mongoose.model<IOrder>("finalorder", orderSchema, "finalorder");

export default OrderModel;
