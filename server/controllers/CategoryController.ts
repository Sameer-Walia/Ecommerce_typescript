import { Request, Response } from "express";
import fs from "fs";
import CatModel from "../models/CategoryModel";

export const savecategory = async (req: Request, res: Response) => 
{
    try
    {
        var picturename;
        if (!req.file) 
        {
            picturename = "noimage.jpg"
        }
        else 
        {
            picturename = req.file.filename;
        }
        const newrecord = new CatModel({ catname: req.body.cname, catpic: picturename })
        const result = await newrecord.save();
        if (result) 
        {
            res.send({ statuscode: 1 })
        }
        else 
        {
            res.send({ statuscode: 0 })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }

}

export const getallcat = async (req: Request, res: Response) => 
{
    try
    {
        const result = await CatModel.find()
        if (result.length === 0) 
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, categorydata: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const delcat = async (req: Request, res: Response) => 
{
    try
    {
        const result = await CatModel.deleteOne({ _id: req.query.id })
        if (result.deletedCount === 1) 
        {
            res.send({ statuscode: 1, msg: "Category Deleted Successfully" })
        }
        else 
        {
            res.send({ statuscode: 0, msg: "Category not Deleted" })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const updatecategory = async (req: Request, res: Response) => 
{
    try
    {
        var picturename;
        if (!req.file) 
        {
            picturename = req.body.oldpicname;//it will save current picname in this constiable
        }
        else 
        {
            picturename = req.file.filename;

            if (req.body.oldpicname !== "noimage.jpg") 
            {
                fs.unlinkSync(`public/uploads/${req.body.oldpicname}`);
            }

        }

        const updateresult = await CatModel.updateOne({ _id: req.body.cid }, { $set: { catname: req.body.upname, catpic: picturename } });

        if (updateresult.modifiedCount === 1) 
        {
            res.send({ statuscode: 1 })
        }
        else 
        {
            res.send({ statuscode: 0 })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

