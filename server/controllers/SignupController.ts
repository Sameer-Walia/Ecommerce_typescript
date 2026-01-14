import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import SignupModel from "../models/SignupModel";
import { sendMail } from "../utils/mailer";
import jwt from "jsonwebtoken";


export const signup = async (req: Request, res: Response) =>
{
    try
    {
        const { name, phone, email, pass } = req.body;

        const acttoken: string = uuidv4();
        const encryp_pass: string = bcrypt.hashSync(pass, 10);

        const newrecord = new SignupModel({ name: name, phone: phone, email: email, password: encryp_pass, usertype: "normal", actstatus: false, token: acttoken, googleId: "" });

        const result = await newrecord.save();
        // console.log(result)

        if (result) 
        {
            const mailOptions = {
                from: 'sameerwalia13@gmail.com', // transporter username email
                to: req.body.email,             // user's email id
                subject: 'Activation Mail from SuperMarket.com',
                html: `Dear ${req.body.name}<br/><br/>Thanks for signing up on our website.<br/><br/>Click on the following link to activate your account.<br/><br/><a href='http://localhost:5173/activateaccount?code=${acttoken}'>Activate Account<a/>`
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




export const resendmail = async (req: Request, res: Response) =>
{
    try 
    {
        const { email } = req.body;

        const user = await SignupModel.findOne({ email: email });
        console.log(user)
        if (user === null) 
        {
            res.send({ statuscode: 0, msg: "User not found with given email" });
        }
        else
        {

            const updateresult = await SignupModel.updateOne({ email: email }, { $set: { actstatus: false } });
            if (updateresult.modifiedCount === 1)
            {
                const mailOptions = {
                    from: 'sameerwalia13@gmail.com',
                    to: email,
                    subject: 'Activation Mail from SuperMarket.com',
                    html: `Dear ${user.name}<br/><br/>Thanks for signing up on our website.<br/><br/>Click on the following link to activate your account.<br/><br/><a href='http://localhost:5173/activateaccount?code=${user.token}'>Activate Account<a/>`
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
                const mailOptions = {
                    from: 'sameerwalia13@gmail.com',
                    to: email,
                    subject: 'Activation Mail from SuperMarket.com',
                    html: `Dear ${user.name}<br/><br/>Thanks for signing up on our website.<br/><br/>Click on the following link to activate your account.<br/><br/><a href='http://localhost:5173/activateaccount?code=${user.token}'>Activate Account<a/>`
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
        }
    }
    catch (e: any) 
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const activateuseraccount = async (req: Request, res: Response) =>
{
    try
    {
        const updateresult = await SignupModel.updateOne({ token: req.body.code }, { $set: { actstatus: true } });
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

export const login = async (req: Request, res: Response) => 
{
    try 
    {
        const result = await SignupModel.findOne({ email: req.body.email }).select("-phone");
        console.log(result)
        if (result === null)
        {
            res.send({ statuscode: 0 })
        }
        else
        {
            if (bcrypt.compareSync(req.body.pass, result.password))
            {
                // .select("-phone"); = so phone:result.phone cannot be store in respdata

                const jsontoken = jwt.sign({ id: result._id, role: result.usertype }, process.env.JWT_SKEY as string, { expiresIn: "15m" })
                const refreshjsontoken = jwt.sign({ id: result._id, role: result.usertype }, process.env.JWT_REFRESH_SKEY as string, { expiresIn: "7d" })

                res.cookie("authToken", jsontoken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 15 * 60 * 1000,
                });

                res.cookie("refreshToken", refreshjsontoken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                const respdata = { _id: result._id, name: result.name, phone: result.phone, email: result.email, usertype: result.usertype, actstatus: result.actstatus }

                res.send({ statuscode: 1, userdata: respdata })

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


export const google_login = async (req: Request, res: Response) => 
{
    try
    {
        const { email, name, googleId } = req.body;

        let user = await SignupModel.findOne({ email: email });

        if (user === null)
        {
            // create new Google user
            const newrecord = new SignupModel({ name, phone: "", email, password: "", usertype: "normal", actstatus: true, token: "", googleId: googleId });

            user = await newrecord.save();
        }

        // create JWT cookies like normal login
        const jsontoken = jwt.sign({ id: user._id, role: user.usertype }, process.env.JWT_SKEY as string, { expiresIn: "15min" });
        const refreshjsontoken = jwt.sign({ id: user._id, role: user.usertype }, process.env.JWT_REFRESH_SKEY as string, { expiresIn: "7d" });

        // set cookies
        res.cookie("authToken", jsontoken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshjsontoken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const respdata = { _id: user._id, name: user.name, phone: user.phone, email: user.email, usertype: user.usertype, actstatus: user.actstatus, googleId: user.googleId }

        res.send({ statuscode: 1, userdata: respdata });

    }
    catch (e)
    {
        console.log(e);
        res.send({ statuscode: -1 });
    }
}

export const logout = (req: Request, res: Response) => 
{
    try 
    {
        res.clearCookie("authToken");
        res.clearCookie("refreshToken");
        res.clearCookie("staysignin");
        res.send({ statuscode: 1 })
    }
    catch (e: any) 
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const changepassword = async (req: Request, res: Response) => 
{
    try
    {
        const result = await SignupModel.findOne({ email: req.body.uname })
        console.log(result)
        if (result === null)
        {
            res.send({ statuscode: 0 })
        }
        else
        {
            if (bcrypt.compareSync(req.body.currpass, result.password))
            {
                const encryp_newpass = bcrypt.hashSync(req.body.newpass, 10)
                const updatepass = await SignupModel.updateOne({ email: req.body.uname }, { $set: { password: encryp_newpass } })
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

export const getallusers = async (req: Request, res: Response) => 
{
    try
    {
        const result = await SignupModel.find();
        if (result.length === 0) 
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, usersdata: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const fetchoneuser = async (req: Request, res: Response) => 
{
    try
    {
        const result = await SignupModel.findOne({ _id: req.params.id });
        if (result === null) 
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, oneuserdata: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const updateoneuser = async (req: Request, res: Response) => 
{
    try
    {
        const update = await SignupModel.updateOne({ _id: req.body.userid }, { $set: { name: req.body.name, phone: req.body.phone, email: req.body.email } })

        if (update.modifiedCount === 1) 
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

export const deluser = async (req: Request, res: Response) => 
{
    try
    {
        const result = await SignupModel.deleteOne({ _id: req.params.uid })
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

export const searchuser = async (req: Request, res: Response) => 
{
    try
    {
        const result = await SignupModel.findOne({ email: req.query.un });
        console.log(result)
        if (result === null) 
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, searchdata: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}


export const ContactUs = async (req: Request, res: Response) =>
{
    try
    {
        const mailOptions = {
            from: 'waliasam13@gmail.com', // transporter username email
            to: 'sameerwalia13@gmail.com',  // any email id of admin where u want to send email
            replyTo: req.body.email,
            subject: 'Message from website - Contact Us Page',
            html: `<b>Name:- </b>${req.body.uname}<br/><b>Phone:- </b>${req.body.phone}<br/><b>Email:- </b>${req.body.email}<br/><b>Message:- </b>${req.body.message}`
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
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}