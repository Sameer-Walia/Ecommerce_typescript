import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./Footer";

function ForgotPassword()
{

    const [uname, setuname] = useState<string>("");
    const [loading, setloading] = useState<boolean>(false);

    async function handlesubmit(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault()
        try
        {
            setloading(true)
            const resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/forgotpassword?un=` + uname)
            if (resp.data.statuscode === 1)
            {
                toast.success("Mail sent. Please check your email to reset Password")
            }
            else if (resp.data.statuscode === 3)
            {
                toast.warn("Incorrect Username")
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
        finally
        {
            setloading(false)
        }
    }

    useEffect(() =>
    {
        document.title = "Forgot Password";
    }, []);

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Forgot Password Page</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">
                    <h2>Forgot Password</h2>

                    <div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">
                        <form name="form1" onSubmit={handlesubmit}>
                            <input type="email" name="un" placeholder="Email Address(username)" required onChange={(e) => setuname(e.target.value)} />
                            {
                                loading ?
                                    <div className="loader-container">
                                        <img src="images/loader.gif" alt="loader" className="loader" />
                                    </div> : <input type="submit" name="btn" value="Submit" />
                            }
                        </form>
                    </div>

                </div>
            </div><br /><br /><br />
            <Footer />
        </>
    )
}
export default ForgotPassword;