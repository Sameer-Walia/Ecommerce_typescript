import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { login } from "../ReduxSlice/authslice";
import type { AppDispatch } from "../store";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

interface User
{
    actstatus: boolean;
    name: string;
    email: string;
    usertype: string;
    _id: string;
}

interface LoginResponse
{
    statuscode: number;
    userdata: User;
}

interface GoogleJwtPayload
{
    email: string;
    name: string;
    sub: string;
}

function Login()
{

    const [email, setemail] = useState<string>('');
    const [pass, setpass] = useState<string>('');
    const [msg] = useState<string>('');
    const [loading, setloading] = useState<boolean>(false);
    const [terms, setterms] = useState<boolean>(false);
    const usercokkie = new Cookies()

    const navi = useNavigate();
    const dispatch = useDispatch<AppDispatch>()

    async function onlogin(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault()
        const logindata = { email, pass };
        try
        {
            setloading(true)
            const resp = await axios.post<LoginResponse>(`${import.meta.env.VITE_API_URL}/api/login`, logindata, { withCredentials: true })

            if (resp.data.statuscode === 0)
            {
                toast.warn("Incorrect Username/Password")
            }
            else if (resp.data.statuscode === 1)
            {
                if (resp.data.userdata.actstatus === true)
                {
                    dispatch(login(resp.data.userdata))
                    sessionStorage.setItem("userdata", JSON.stringify(resp.data.userdata));
                    if (terms)  
                    {
                        usercokkie.set("staysignin", JSON.stringify(resp.data.userdata), { maxAge: 7 * 24 * 60 * 60, });
                    }
                    if (resp.data.userdata.usertype === "admin")
                    {
                        navi("/adminhome")
                    }
                    else
                    {
                        navi("/home")
                    }
                }
                else
                {
                    toast.error("Your account is not activated , please check your email and activate your account")
                }
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
        document.title = "Login";
    }, []);

    async function handleGoogleLoginSuccess(credentialResponse: CredentialResponse)
    {
        if (!credentialResponse.credential)
        {
            toast.error("Google login failed");
            return;
        }
        try
        {
            const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);

            const data = { email: decoded.email, name: decoded.name, googleId: decoded.sub, };

            const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/google-login`, data, { withCredentials: true, })
            {
                if (resp.data.statuscode === 1) 
                {
                    dispatch(login(resp.data.userdata))
                    sessionStorage.setItem("userdata", JSON.stringify(resp.data.userdata));
                    if (terms)  
                    {
                        usercokkie.set("staysignin", JSON.stringify(resp.data.userdata), { maxAge: 7 * 24 * 60 * 60, });
                    }
                    if (resp.data.userdata.usertype === "admin")
                    {
                        toast.success("Successfully Login")
                        navi("/adminhome")
                    }
                    else
                    {
                        toast.success("Successfully Login")
                        navi("/")
                    }

                }
                else
                {
                    toast.error("Some Problem Occured")
                }
            }
        }
        catch (e: any) 
        {
            toast.error("Error Occured " + e.message)
        }
    }

    function handleGoogleLoginError()
    {
        toast.error("Google Login Failed");
    }


    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Login Page</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">
                    <h2>Login Form</h2>

                    <div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">
                        <form name="form1" onSubmit={onlogin}>
                            <input type="email" name="un" placeholder="Email Address(username)" required onChange={(e) => setemail(e.target.value)} />
                            <input type="password" name="pass" placeholder="Password" required onChange={(e) => setpass(e.target.value)} />
                            <label className="checkbox">
                                <input type="checkbox" name="cbx1" onChange={(e) => setterms(e.target.checked)} /><i> </i>Stay Sign In
                            </label>
                            {
                                loading ?
                                    <div className="loader-container">
                                        <img src="images/loader.gif" alt="loader" className="loader" />
                                    </div> : <input type="submit" name="btn" value="Login" />
                            }
                            <br /><b>or</b>
                            <div style={{ marginTop: "20px" }}>
                                <GoogleLogin
                                    onSuccess={handleGoogleLoginSuccess}
                                    onError={handleGoogleLoginError}
                                />
                            </div>

                            <br /><Link to="/forgotpassword">Forgot Password</Link>
                            {msg}
                        </form>
                    </div>
                    <h4>For New People</h4>

                    <p><Link to="/signup">Register Here</Link> (Or) go back to <Link to="/">Home</Link><span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span></p>
                </div>
            </div>
            <br /><br /><br />
            <Footer />
        </>
    )
}
export default Login;