import mongoose, { Schema, Document, Model } from "mongoose";

interface IResetPassword extends Document
{
    email: string;
    exptime: Date;
    token: string;
}


const ResetPassSchema: Schema<IResetPassword> = new Schema<IResetPassword>(
    {
        email: {
            type: String,
            required: true,
        },
        exptime: {
            type: Date,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
    },
    { versionKey: false }
);


const ResetPassModel: Model<IResetPassword> = mongoose.model<IResetPassword>("resetpass", ResetPassSchema, "resetpass");

export default ResetPassModel;
