import { Request, Response } from "express";
import ResetPassModel from "../models/ResetPasswordModel";
import SignupModel from "../models/SignupModel";
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "../utils/mailer";
import bcrypt from "bcryptjs";


export const forgotpassword = async (req: Request, res: Response) => 
{
    try 
    {
        const result = await SignupModel.findOne({ email: req.query.un })
        console.log(result)
        if (result === null)
        {
            res.send({ statuscode: 3 })
        }
        else
        {
            const passtoken = uuidv4();

            const currentDateUTC = new Date(); // Get the current Date in GMt/UTC
            const ISTOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5 hours 30 minutes)
            const fifteenminOffset = 15 * 60 * 1000; // IST offset in milliseconds (15 minutes)
            const expiretime = new Date(currentDateUTC.getTime() + ISTOffset + fifteenminOffset)  // add 15 min more

            const newrecord = new ResetPassModel({ email: req.query.un, exptime: expiretime, token: passtoken })
            const result2 = await newrecord.save()
            if (!result2)
            {
                return res.send({ statuscode: 0 });
            }
            if (result2)
            {
                const mailOptions = {
                    from: 'sameerwalia13@gmail.com', // transporter username email
                    to: req.query.un as string,             // user's email id
                    subject: 'Reset Password Mail from SuperMarket.com',
                    html: `Dear ${result.name}<br/><br/>Click on the Following Link to Reset your Password :-.<br/><br/><a href='http://localhost:5173/resetpassword?code=${passtoken}'>Reset Password<a/>`
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

    }
    catch (e: any) 
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}


export const checktoken = async (req: Request, res: Response) =>
{
    const currentDateUTC = new Date(); // Get the current Date in GMt/UTC
    const ISTOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5 hours 30 minutes)
    const currtime = new Date(currentDateUTC.getTime() + ISTOffset)
    console.log(currtime)

    try
    {
        const result = await ResetPassModel.findOne({ token: req.query.token })
        console.log(result)
        {
            if (result === null)
            {
                res.send({ statuscode: 0 })
            }
            else
            {
                if (currtime < result.exptime)   // 5:20 < 5:30
                {
                    res.send({ statuscode: 1 })
                }
                else
                {
                    // delete Token after it get expired
                    const result2 = await ResetPassModel.deleteOne({ token: req.query.token })
                    if (result2.deletedCount === 1) 
                    {
                        res.send({ statuscode: 0 })
                    }
                    else 
                    {
                        res.send({ statuscode: 2 })
                    }
                }
            }
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}


export const resetpassword = async (req: Request, res: Response) => 
{
    try
    {
        const result = await ResetPassModel.findOne({ token: req.body.token })
        console.log(result)
        if (result === null)
        {
            res.send({ statuscode: 0 })
        }
        else
        {
            const encryp_newpass = bcrypt.hashSync(req.body.newpass, 10)
            const updatepass = await SignupModel.updateOne({ email: result.email }, { $set: { password: encryp_newpass } })
            if (updatepass.modifiedCount === 1) 
            {
                res.clearCookie("authToken");
                res.clearCookie("refreshToken");
                res.clearCookie("staysignin");
                res.send({ statuscode: 1 })
            }
            else 
            {
                res.send({ statuscode: 0 })
            }

        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}