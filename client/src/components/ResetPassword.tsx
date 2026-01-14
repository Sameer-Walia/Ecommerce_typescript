import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { LogOut } from "../ReduxSlice/authslice";
import Footer from "./Footer";

function ResetPassword()
{

    const dispatch = useDispatch()

    const [newpass, setnewpass] = useState<string>("");
    const [cnewpass, setcnewpass] = useState<string>("");
    const [flag, setflag] = useState<boolean>(false);
    const [loading, setloading] = useState<boolean>(false);
    const [params] = useSearchParams()
    const token = params.get("code")
    const navigate = useNavigate()

    useEffect(() =>
    {
        verifytoken()
    }, [token])

    async function verifytoken()
    {
        try
        {
            const resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/checktoken?token=` + token)
            if (resp.data.statuscode === 1)
            {
                setflag(true)
            }
            else if (resp.data.statuscode === 0)
            {
                setflag(false)
            }
            else if (resp.data.statuscode === 2)
            {
                setflag(false)
            }
            else
            {
                toast.error("Some Problem Occured")
            }
        }
        catch (e: any)
        {
            toast.error("Error Occured " + e.message)
        }
    }

    useEffect(() =>
    {
        document.title = "Reset Password";
    }, []);

    async function resetpassword(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault()
        try
        {
            setloading(true)
            
            if (newpass === cnewpass)
            {
                const apidata = { newpass, token }
                const resp = await axios.put(`${import.meta.env.VITE_API_URL}/api/resetpassword`, apidata)
                if (resp.data.statuscode === 1)
                {
                    toast.success("Password Reset Successfully")
                    sessionStorage.clear()
                    dispatch(LogOut())
                    navigate("/login")
                    toast.info("You have been logged out , login with new password")
                }
                else if (resp.data.statuscode === 0)
                {
                    toast.warn("Password Not Reset Successfully")
                }
                else
                {
                    toast.error("Some Problem Occured")
                }
            }
            else
            {
                toast.warn("New Password and Confirm Mew Password doesnot Match")
            }

        }
        catch (e: any)
        {
            toast.error("Error Occured " + e.message)
        }
        finally
        {
            setloading(false)
        }
    }

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Reset Password</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">
                    <h2>Reset Password</h2>

                    <div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">

                        {
                            flag ?
                                <form name="form1" onSubmit={resetpassword}>
                                    <input type="password" name="newpass" placeholder="New Password" required onChange={(e) => setnewpass(e.target.value)} />
                                    <input type="password" name="cnewpass" placeholder="Confirm New Password" required onChange={(e) => setcnewpass(e.target.value)} />
                                    {
                                        loading ?
                                            <div className="loader-container">
                                                <img src="images/loader.gif" alt="loader" className="loader" />
                                            </div> : <input type="submit" name="btn" value="Reset Password" />
                                    }
                                </form> : <h2>Invalid Token or Token expired</h2>

                        }


                    </div>

                </div>
            </div><br /><br /><br />
            <Footer />
        </>
    )
}
export default ResetPassword;