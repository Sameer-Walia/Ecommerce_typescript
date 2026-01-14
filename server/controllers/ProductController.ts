import { Request, Response } from "express";
import fs from "fs"
import productmodel from "../models/ProductModel";

interface MulterRequest extends Request
{
    files?: {
        picture?: Express.Multer.File[];
        extraimages?: Express.Multer.File[];
        pic?: Express.Multer.File[];
    };
}

export const addproduct = async (req: Request & MulterRequest, res: Response) => 
{
    try
    {

        const mainImage: string = req.files?.picture?.[0]?.filename || "noimage.jpg";
        const extraImage: string[] = req.files?.extraimages?.map((file) => file.filename) || []; // Keep .map where you need a new array (extraImage).

        const currentDateUTC = new Date(); // Get the current Date in GMt/UTC
        const ISTOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5 hours 30 minutes)
        const currentDateIST = new Date(currentDateUTC.getTime() + ISTOffset)  // convert to IST

        const newrecord = new productmodel({ catid: req.body.catid, subcatid: req.body.subcatid, Name: req.body.pname, Rate: req.body.rate, Discount: req.body.dis, Stock: req.body.stock, Description: req.body.descp, Picture: mainImage, ExtraPicture: extraImage, Addedon: currentDateIST })

        const result = await newrecord.save()
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

export const fetchproductbycatidandsubcatid = async (req: Request, res: Response) => 
{
    try
    {
        const result = await productmodel.find({ catid: req.query.catid, subcatid: req.query.subcatid }).populate('catid').populate('subcatid')
        if (result.length === 0) 
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, proddata: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const delproduct = async (req: Request, res: Response) =>
{
    try
    {
        const result = await productmodel.deleteOne({ _id: req.query.id })
        if (result.deletedCount === 1) 
        {
            res.send({ statuscode: 1, msg: "product deleted statuscodefully" })
        }
        else 
        {
            res.send({ statuscode: 0, msg: "product not deleted" })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const updateproduct = async (req: Request & MulterRequest, res: Response) => 
{
    try
    {

        let picturename;

        if (!req.files?.pic)
        {
            picturename = req.body.oldpicname ? req.body.oldpicname : null;
        }
        else
        {
            picturename = req.files?.pic?.[0]?.filename;

            if (req.body.oldpicname !== "noimage.jpg")
            {
                fs.unlinkSync(`public/uploads/${req.body.oldpicname}`);
            }
        }

        // ---------- EXTRA IMAGES ----------

        let extraImage;
        if (!req.files?.["extraimages"]) 
        {
            extraImage = req.body.oldextrapicname ? req.body.oldextrapicname : [];
        }
        else 
        {
            extraImage = req.files?.["extraimages"]?.map(file => file.filename)

            // delete old extra images if provided
            if (req.body.oldextrapicname)
            {
                (Array.isArray(req.body.oldextrapicname)
                    ? req.body.oldextrapicname
                    : [req.body.oldextrapicname]
                ).forEach((img: string) =>
                {
                    if (img !== "noimage.jpg")
                    {
                        fs.unlinkSync(`public/uploads/${img}`);
                    }
                });
            }

        }

        const currentDateUTC = new Date();
        const ISTOffset = 5.5 * 60 * 60 * 1000;
        const currentDateIST = new Date(currentDateUTC.getTime() + ISTOffset)

        const updateresult = await productmodel.updateOne({ _id: req.body.productid }, { $set: { catid: req.body.catid, subcatid: req.body.subcatid, Name: req.body.upname, Rate: req.body.uprate, Discount: req.body.updis, Stock: req.body.upstock, Description: req.body.updescp, Picture: picturename, ExtraPicture: extraImage, Addedon: currentDateIST } });

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

export const fetchlatestprods = async (req: Request, res: Response) => 
{
    try
    {
        const result = await productmodel.find().sort({ "Addedon": -1 }).limit(6)
        //result will become an array because find function returns an array
        if (result.length === 0) 
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, proddata: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const fetchproductbyid = async (req: Request, res: Response) => 
{
    try
    {
        const result = await productmodel.findOne({ _id: req.query.id })
        if (result === null) 
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, product: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}


export const searchproducts = async (req: Request, res: Response) =>
{
    try
    {
        const searchtext = req.query.q;
        const result = await productmodel.find({ Name: { $regex: '.*' + searchtext, $options: 'i' } })
        // i  means case-insensitive.
        if (result.length === 0)
        {
            res.send({ statuscode: 0 })
        }
        else
        {
            res.send({ statuscode: 1, proddata: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const fetchprodbysubcatid = async (req: Request, res: Response) => 
{
    try
    {
        const result = await productmodel.find({ subcatid: req.query.subid }).populate('catid').populate('subcatid')
        if (result.length === 0) 
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, proddata: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}