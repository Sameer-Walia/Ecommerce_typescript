import { Request, Response } from "express";
import CartModel from "../models/CartModel";


export const addtocart = async (req: Request, res: Response) => 
{
    try
    {
        const newrecord = new CartModel({ pid: req.body.pid, Picture: req.body.picture, ProdName: req.body.pname, Rate: req.body.rate, Qty: req.body.qty, TotalCost: req.body.tc, email: req.body.email })

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

export const getcart = async (req: Request, res: Response) => 
{
    try 
    {
        const result = await CartModel.find({ email: req.query.un })
        if (result.length === 0)
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, cartinfo: result })
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
        const result = await CartModel.deleteOne({ _id: req.params.id })
        if (result.deletedCount === 1) 
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