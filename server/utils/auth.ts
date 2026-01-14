import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthPayload extends JwtPayload
{
    role: string;
    id: string;
}

export function verifyjsontoken(req: Request, res: Response, next: NextFunction)
{
    let token = req.cookies.authToken
    if (token)
    {
        try
        {
            const decoded = jwt.verify(token, process.env.JWT_SKEY as string) as AuthPayload
            console.log(decoded)
            req.utype = decoded.role
            req.id = decoded.id
            return next()
        }
        catch (e)
        {
            return res.send({ statuscode: -5, msg: "Invalid Token" })
        }
    }

    const refreshtoken = req.cookies.refreshToken;
    if (!refreshtoken)
    {
        return res.send({ statuscode: -5, msg: "Session expired. Please log in again." })
    }
    try
    {
        const decoded = jwt.verify(refreshtoken, process.env.JWT_REFRESH_SKEY as string) as AuthPayload
        const newauthToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SKEY as string, { expiresIn: "15m" })

        res.cookie("authToken", newauthToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });

        req.utype = decoded.role
        req.id = decoded.id
        return next()
    }
    catch (e)
    {
        return res.send({ statuscode: -5, msg: "Invalid refresh Token" })
    }
}

export function verifyadmin(req: Request, res: Response, next: NextFunction)
{
    console.log(req.utype)
    if (req.utype === "admin")
    {
        return next();
    }
    else
    {
        return res.send({ statuscode: -5, msg: "Only Admin can access" })
    }
}