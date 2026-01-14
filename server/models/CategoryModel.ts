import mongoose, { Schema, Document, Model } from "mongoose";

interface ICategory extends Document
{
    catname: string;
    catpic?: string;
}

const CatSchema: Schema<ICategory> = new Schema<ICategory>(
    {
        catname:
        {
            type: String,
            required: true,
            unique: true,
        },
        catpic:
        {
            type: String,
        },
    },
    { versionKey: false }
);

const CatModel: Model<ICategory> = mongoose.model<ICategory>("category", CatSchema, "category");

export default CatModel;
