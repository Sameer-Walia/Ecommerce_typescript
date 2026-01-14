import mongoose, { Document, Model, Schema } from "mongoose";

interface ISignup extends Document
{
    name: string;
    phone: string;
    email: string;
    password: string;
    usertype: string;
    actstatus: boolean;
    token: string;
    googleId: string
}

const SignupSchema: Schema<ISignup> = new Schema<ISignup>(
    {
        name:
        {
            type: String,
            required: true
        },
        phone:
        {
            type: String,
            required: true
        },
        email:
        {
            type: String,
            required: true,
            unique: true
        },
        password:
        {
            type: String,
            required: true
        },
        usertype:
        {
            type: String,
            default: "normal"
        },
        actstatus:
        {
            type: Boolean,
            default: false
        },
        token:
        {
            type: String
        },
        googleId:
        {
            type: String
        }
    },
    {
        versionKey: false,
    }
);

const SignupModel: Model<ISignup> = mongoose.model<ISignup>("signup", SignupSchema, "signup");

export default SignupModel