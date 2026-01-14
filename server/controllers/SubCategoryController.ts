import { Request, Response } from "express";
import fs from "fs";
import SubCatModel from "../models/SubCategoryModel";

export const addsubcategory = async (req: Request, res: Response) => 
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
            picturename = req.file.filename
        }
        const newrecord = new SubCatModel({ catid: req.body.catid, subcatname: req.body.subcatname, subcatpic: picturename })
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

export const fetchsubcatbycatid = async (req: Request, res: Response) => 
{
    try
    {
        const result = await SubCatModel.find({ catid: req.query.cid }).populate('catid');
        if (result.length === 0) 
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, subcatalldata: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const delsubcat = async (req: Request, res: Response) =>
{
    try
    {
        const result = await SubCatModel.deleteOne({ _id: req.query.id })
        if (result.deletedCount === 1) 
        {
            res.send({ statuscode: 1, msg: "Subcategory deleted statuscodefully" })
        }
        else 
        {
            res.send({ statuscode: 0, msg: "Subcategory not deleted" })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const updatesubcategory = async (req: Request, res: Response) => 
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

        const updateresult = await SubCatModel.updateOne({ _id: req.body.subcatid }, { $set: { subcatname: req.body.usubname, catid: req.body.cid, subcatpic: picturename } });

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


