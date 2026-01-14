import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface ValidationErrors
{
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    passmatch?: string;
    terms?: string;
}

interface SignupResponse
{
    statuscode: number;
    msg?: string;
}

function Signup()
{

    const [name, setname] = useState<string>("");
    const [phone, setphone] = useState<string>("");
    const [email, setemail] = useState<string>("");
    const [pass, setpass] = useState<string>("");
    const [cpass, setcpass] = useState<string>("");
    const [terms, setterms] = useState<boolean>(false);
    const [verrors, setverrors] = useState<ValidationErrors>({});
    const [loading, setloading] = useState<boolean>(false);

    const navi = useNavigate();

    async function onregister(e: React.FormEvent<HTMLFormElement>) 
    {
        e.preventDefault();
        if (validateForm() === true)
        {
            if (terms === true) 
            {
                if (pass === cpass) 
                {
                    try 
                    {
                        setloading(true);
                        const reqdata = { name, phone, email, pass }
                        const resp = await axios.post<SignupResponse>(`${import.meta.env.VITE_API_URL}/api/signup`, reqdata)

                        if (resp.data.statuscode === 1)
                        {
                            navi("/thanks")
                            toast.success("Signup Successfull , check your email to activate your account")
                        }
                        else if (resp.data.statuscode === 2)
                        {
                            navi("/nothanks")
                            toast.warn("Signup Successfull , error while sending activation mail")
                        }
                        else if (resp.data.statuscode === 0)
                        {
                            toast.warn(resp.data.msg)
                        }
                        else
                        {
                            toast.warn("Some Problem Occured")
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
                else 
                {
                    toast.warning("Password and Confirm Password doesnot Match")
                }
            }
            else 
            {
                toast.warn("Please accept terms and condition")
            }
        }
    }

    function validateForm(): boolean
    {
        const errors: ValidationErrors = {};

        if (name.length < 3)
        {
            errors.name = "Name must be at least 3 characters long";
        }

        if (!/^\d{10}$/.test(phone))
        {
            errors.phone = "Phone must be a 10-digit number";
        }

        if (!/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
        {
            errors.email = "Invalid email format";
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}/.test(pass))
        {
            errors.password = "Weak password";
        }

        if (pass !== cpass)
        {
            errors.passmatch = "Passwords do not match";
        }

        if (!terms)
        {
            errors.terms = "Please accept terms and conditions";
        }

        setverrors(errors);
        if (Object.keys(errors).length > 0) 
        {
            return false
        }
        else
        {
            return true
        }
    }

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Register Page</li>
                    </ol>
                </div>
            </div>

            <div className="register">
                <div className="container">
                    <h2>Register Here</h2>
                    <div className="login-form-grids">
                        <h5>profile information</h5>
                        <form name="form1" onSubmit={onregister}>
                            <input type="text" name="pname" placeholder="First Name..." required minLength={3} onChange={(e) => setname(e.target.value)} />
                            {verrors.name ? <span>{verrors.name}</span> : null}<br />

                            <input type="tel" name="phone" placeholder="Phone..." required minLength={10} maxLength={10} onChange={(e) => setphone(e.target.value)} />
                            {verrors.phone ? <span>{verrors.phone}</span> : null}


                            <h6>Login information</h6>
                            <input type="email" name="un" placeholder="Email Address(Username)" required onChange={(e) => setemail(e.target.value)} />
                            {verrors.email ? <span>{verrors.email}</span> : null}


                            <input type="password" name="passd" placeholder="Password" required onChange={(e) => setpass(e.target.value)} />
                            {verrors.password ? <span>{verrors.password}</span> : null}


                            <input type="password" name="cpass" placeholder="Password Confirmation" required onChange={(e) => setcpass(e.target.value)} />
                            {verrors.passmatch ? <span>{verrors.passmatch}</span> : null}


                            <div className="register-check-box">
                                <div className="check">
                                    <label className="checkbox">
                                        <input type="checkbox" name="cbx1" onChange={(e) => setterms(e.target.checked)} /><i> </i>I accept the terms and conditions
                                    </label>
                                    {verrors.terms ? <span>{verrors.terms}</span> : null}
                                </div>
                            </div>

                            {
                                loading ?
                                    <div className="loader-container">
                                        <br /><img src="images/loader.gif" alt="loader" className="loader" />
                                    </div> : <input type="submit" name="btn" value="Register" />
                            }

                        </form>
                    </div>
                    <div className="register-home">
                        <Link to="/">Home</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Signup;
