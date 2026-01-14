import { Request, Response } from "express";
import OrderModel from "../models/OrderModel";
import CartModel from "../models/CartModel";
import productmodel from "../models/ProductModel";
import { sendMail } from "../utils/mailer";


export const saveorder = async (req: Request, res: Response) =>
{
    try
    {
        const newrecord = new OrderModel({ address: req.body.address, billamt: req.body.tbill, email: req.body.email, OrderDate: new Date(), PayMode: req.body.pmode, CardDetails: req.body.carddetails, OrderProducts: req.body.cartinfo, status: "Payment received, processing" })

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

export const updatestock = async (req: Request, res: Response) =>
{
    try
    {
        const cartdata = req.body.cartinfo;
        var updateresult;
        for (var x = 0; x < cartdata.length; x++)
        {
            updateresult = await productmodel.updateOne({ _id: cartdata[x].pid }, { $inc: { "Stock": -cartdata[x].Qty } });
        }
        if (updateresult?.modifiedCount === 1)
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

export const deletecart = async (req: Request, res: Response) =>
{
    try
    {
        const result = await CartModel.deleteMany({ email: req.query.un })
        if (result.deletedCount >= 1)
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


export const getorderid = async (req: Request, res: Response) =>
{
    try
    {
        const name = req.query.name;
        const result = await OrderModel.findOne({ email: req.query.un }).sort({ "OrderDate": -1 });
        console.log(result)
        if (result)
        {
            // on email to show multiple product details 
            const productList = result.OrderProducts.map(item => `
        <li>
          ${item.ProdName} (Qty: ${item.Qty}) - ₹${item.TotalCost}
        </li>
      `).join("");

            const mailOptions = {
                from: 'sameerwalia13@gmail.com',
                to: req.query.un as string,
                subject: 'Order Details from SuperMarket.com',
                html: `
          Dear ${name},<br/><br/>
          Thanks for the Order.<br/><br/>
          <b>Your Order Details are:</b><br/><br/>
          <b>Order Number :- </b>${result._id}<br/>
          <b>Products :- </b> :- <ul>${productList}</ul>
          <b>Bill :- </b> ₹${result.billamt}<br/>
          <b>Payment Mode :- </b> ${result.PayMode}<br/>
          <b>Order Date :- </b> ${new Date(result.OrderDate).toLocaleString()}<br/>
          <b>Address :- </b> ${result.address.house}, ${result.address.area}, ${result.address.city}, ${result.address.state} - ${result.address.pincode}<br/>
          <b>Status :- </b> ${result.status}
        `
            };

            const mailresp = await sendMail(mailOptions);
            if (mailresp === true)
            {
                res.send({ statuscode: 1 })
            }
            else
            {
                res.send({ statuscode: 2 })
            }
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


export const getallordersbydate = async (req: Request, res: Response) =>
{
    try
    {
        const inputDate = req.query.odate as string   // Eg = "2025-04-22"
        const paymode = req.query.pmode
        console.log(paymode)
        const status = req.query.status
        console.log(status)

        // Convert the input date to IST timezone start & end of day
        const startOfDay = new Date(new Date(inputDate).setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date(inputDate).setHours(23, 59, 59, 999));

        // $gte = greater than equal to  and   $lte = less than equal to

        var result;

        if (paymode === undefined && status === undefined)
        {
            result = await OrderModel.find({ OrderDate: { $gte: startOfDay, $lte: endOfDay } }).sort({ "OrderDate": -1 })
        }
        else if (paymode === undefined)
        {
            result = await OrderModel.find({ OrderDate: { $gte: startOfDay, $lte: endOfDay }, status: status }).sort({ "OrderDate": -1 })
        }
        else if (status === undefined)
        {
            result = await OrderModel.find({ OrderDate: { $gte: startOfDay, $lte: endOfDay }, PayMode: paymode }).sort({ "OrderDate": -1 })
        }
        else
        {
            result = await OrderModel.find({ OrderDate: { $gte: startOfDay, $lte: endOfDay }, PayMode: paymode, status: status }).sort({ "OrderDate": -1 })
        }
        if (result.length === 0)
        {
            res.send({ statuscode: 0 })
        }
        else
        {
            res.send({ statuscode: 1, ordersdata: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}


export const delorder = async (req: Request, res: Response) => 
{
    try
    {
        const result = await OrderModel.deleteOne({ _id: req.params.id })
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


export const updatestatus = async (req: Request, res: Response) =>
{
    try
    {
        const updateresult = await OrderModel.updateOne({ _id: req.body.orderid }, { $set: { status: req.body.newst } });

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

export const SearchOrderId = async (req: Request, res: Response) => 
{
    try
    {
        const result = await OrderModel.find({ _id: req.query.un })
        if (result.length === 1) 
        {
            res.send({ statuscode: 1, proddata: result })
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

export const getuserorders = async (req: Request, res: Response) =>
{
    try
    {
        const result = await OrderModel.find({ email: req.query.un }).sort({ "OrderDate": -1 })

        if (result.length === 0)
        {
            res.send({ statuscode: 0 })
        }
        else
        {
            res.send({ statuscode: 1, ordersdata: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const getorderproducts = async (req: Request, res: Response) =>
{
    try
    {
        const result = await OrderModel.findOne({ _id: req.query.orderno });
        if (result === null)
        {
            res.send({ statuscode: 0 })
        }
        else
        {
            res.send({ statuscode: 1, items: result.OrderProducts })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}