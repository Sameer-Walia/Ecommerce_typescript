import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Rootstate } from "../store";
import { LogOut } from "../ReduxSlice/authslice";
import Footer from "./Footer";

function ChangePassword()
{

    const { email } = useSelector((state: Rootstate) => state.auth)
    const dispatch = useDispatch();
    const [currpass, setcurrpass] = useState<string>("");
    const [newpass, setnewpass] = useState<string>("");
    const [cnewpass, setcnewpass] = useState<string>("");
    const [msg] = useState<string>("");

    const navi = useNavigate();

    async function onchangepassword(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault()

        const uname = email;
        const apidata = { currpass, newpass, uname };

        try
        {
            if (currpass !== newpass)
            {
                if (newpass === cnewpass)
                {

                    const resp = await axios.put(`${import.meta.env.VITE_API_URL}/api/changepassword`, apidata, { withCredentials: true });

                    if (resp.data.statuscode === 0)
                    {
                        toast.warn("Current Password Incorrect")
                    }
                    else if (resp.data.statuscode === 1)
                    {
                        toast.success("Password changed successfully");
                        dispatch(LogOut())
                        sessionStorage.clear();
                        // sessionStorage.removeItem("userdata");
                        navi("/login")
                        toast.info("You have been logged out , login with new password");
                    }
                    else
                    {
                        toast.error("Some Problem Occured")
                    }
                }
                else
                {
                    toast.info("New Password and confirm new password does not match")
                }
            }
            else
            {
                toast.info("Current Password and new Pasword are same")
            }
        }
        catch (e: any)
        {
            toast.error("Error Occured " + e.message)
        }
    }

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Change Password</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">
                    <h2>Change Password</h2>

                    <div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">
                        <form name="form1" onSubmit={onchangepassword}>
                            <input type="password" name="currpass" placeholder="current password" required onChange={(e) => setcurrpass(e.target.value)} />
                            <input type="password" name="newpass" placeholder="new password" required onChange={(e) => setnewpass(e.target.value)} />
                            <input type="password" name="cnewpass" placeholder="confirm new password" required onChange={(e) => setcnewpass(e.target.value)} />
                            <input type="submit" name="btn" value="Change Password" /><br /><br />
                            {msg}
                        </form>
                    </div>
                    <h4>For New People</h4>

                    <p><Link to="/signup">Register Here</Link> (Or) go back to <Link to="/">Home</Link><span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span></p>
                </div>
            </div><br /><br />
            <Footer />
        </>
    )
}
export default ChangePassword;