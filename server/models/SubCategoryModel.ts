import mongoose, { Schema, Document, Model } from "mongoose";

interface ISubCategory extends Document
{
    catid: mongoose.Types.ObjectId;
    subcatname: string;
    subcatpic?: string;
}

const SubCatSchema: Schema<ISubCategory> = new Schema<ISubCategory>(
    {
        catid:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },
        subcatname:
        {
            type: String,
            unique: true,
            required: true,
        },
        subcatpic:
        {
            type: String,
        },
    },
    { versionKey: false }
);

const SubCatModel: Model<ISubCategory> = mongoose.model<ISubCategory>("subcategory", SubCatSchema, "subcategory");

export default SubCatModel;
