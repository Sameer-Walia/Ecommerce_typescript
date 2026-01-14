import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Rootstate } from "../store";

function CheckOut()
{
    const { email } = useSelector((state: Rootstate) => state.auth)

    const [fname, setfname] = useState<string>("");
    const [lname, setlname] = useState<string>("");
    const [phone, setphone] = useState<string>("");
    const [ophone, setophone] = useState<string>("");
    const [state, setstate] = useState<string>("");
    const [city, setcity] = useState<string>("");
    const [area, setarea] = useState<string>("");
    const [house, sethouse] = useState<string>("");
    const [pincode, setpincode] = useState<string>("");
    const [pmode, setpmode] = useState<string>("");;
    const [flag, setflag] = useState<boolean>(false);
    const [holdername, setholdername] = useState<string>("");
    const [cardno, setcardno] = useState<string>("");
    const [exp, setexp] = useState<string>("");
    const [cvv, setcvv] = useState<string>("");

    const navigate = useNavigate()

    useEffect(() =>
    {
        if (pmode !== "") 
        {
            if (pmode === "Debit Card / Credit Card") 
            {
                setflag(true);
            }
            else if (pmode === "Cash on Delivery") 
            {
                setflag(false);
            }
        }
        else 
        {
            setflag(false);
        }

    }, [pmode])

    useEffect(() =>
    {
        if (sessionStorage.getItem("userdata") === null)
        {
            navigate("/login")
            toast.error("please login to access the page")
        }
    }, [])

    useEffect(() =>
    {
        document.title = "Check-Out";
    }, []);

    async function oncheckout(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault()
        const address = { fname, lname, phone, ophone, state, city, area, house, pincode }
        const carddetails = { holdername, cardno, exp, cvv }
        const cartdata = sessionStorage.getItem("cartdata")
        if (!cartdata) return
        const cartinfo = JSON.parse(cartdata);

        const checkoutdata = { address, tbill: sessionStorage.getItem("tbill"), email: email, pmode, carddetails, cartinfo };

        try 
        {
            const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/saveorder`, checkoutdata)

            if (resp.data.statuscode === 0) 
            {
                toast.error("Error while making the payment");
            }

            else if (resp.data.statuscode === 1) 
            {
                updatestock();
            }
            else 
            {
                toast.error("Some error occured");
            }
        }
        catch (e: any) 
        {
            toast.error("Error Occured " + e.message)
        }

    }

    async function updatestock() 
    {
        const cartdata = sessionStorage.getItem("cartdata")
        if (!cartdata) return
        const cartinfo = { cartinfo: JSON.parse(cartdata) };
        try 
        {
            const resp = await axios.put(`${import.meta.env.VITE_API_URL}/api/updatestock`, cartinfo)

            if (resp.data.statuscode === 0) 
            {
                toast.error("Error while updating stock")
            }
            else if (resp.data.statuscode === 1) 
            {
                emptycart();
            }
            else 
            {
                toast.error("Some error occured");
            }
        }
        catch (e: any) 
        {
            toast.error("Error Occured " + e.message)
        }
    }

    async function emptycart() 
    {
        try 
        {
            const resp = await axios.delete(`${import.meta.env.VITE_API_URL}/api/deletecart?un=` + email)

            if (resp.data.statuscode === 0) 
            {
                toast.error("Error while deleting cart")
            }
            else if (resp.data.statuscode === 1) 
            {
                sessionStorage.removeItem("cartdata");
                navigate("/ordersummary");
            }
            else 
            {
                toast.error("Some error occured");
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
                        <li className="active">CheckOut</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">
                    <h2>CheckOut </h2>

                    <div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">
                        <form name="form1" onSubmit={oncheckout}>
                            <input type="text" name="fname" placeholder="First Name..." required onChange={(e) => setfname(e.target.value)} /><br />
                            <input type="text" name="lname" placeholder="Last Name..." required onChange={(e) => setlname(e.target.value)} /><br />
                            <input type="tel" name="phone" placeholder="Phone..." required onChange={(e) => setphone(e.target.value)} /><br />
                            <input type="tel" name="phone" placeholder="Optional Phone" required onChange={(e) => setophone(e.target.value)} /><br />
                            Country/Region<br />
                            <b>India</b><br /><br />
                            <select name="select1" onChange={(e) => setstate(e.target.value)} className="form-control" required>
                                <option value="">Choose State</option>
                                <option>Punjab</option>
                                <option>Mahrashtra</option>
                                <option>Banglore</option>
                                <option>Delhi</option>
                                <option>Gujrat</option>
                                <option>Rajasthan</option>
                                <option>Chennai</option>
                            </select><br />
                            <input type="text" name="fname" placeholder="Enter town/city" required onChange={(e) => setcity(e.target.value)} /><br />

                            <b>Street Address</b><br /><br />
                            <input type="text" name="area" placeholder="Apartment/Area" required onChange={(e) => setarea(e.target.value)} /><br />
                            <input type="text" name="house" placeholder="House number and Street name" required onChange={(e) => sethouse(e.target.value)} /><br />
                            <input type="number" name="pincode" placeholder="Enter PINCODE" required onChange={(e) => setpincode(e.target.value)} /><br />

                            <select name="pmode" className="form-control" onChange={(e) => setpmode(e.target.value)} required>
                                <option value="">Choose Payment Mode</option>
                                <option>Cash on Delivery</option>
                                <option>Debit Card / Credit Card</option>
                            </select><br />

                            {
                                flag === true ?
                                    <>
                                        <input type="text" name="hname" placeholder="Holder Name" onChange={(e) => setholdername(e.target.value)} required /><br />
                                        <input type="text" name="cardno" placeholder="Card Number" onChange={(e) => setcardno(e.target.value)} required /><br />
                                        <input type="text" name="expdt" placeholder="Expiry Date" onChange={(e) => setexp(e.target.value)} required />
                                        <input type="password" name="cvv" placeholder="CVV" onChange={(e) => setcvv(e.target.value)} required /><br />
                                    </> : null
                            }
                            <input type="submit" name="btn" value="Make Payment" /><br />

                        </form>
                    </div>

                </div>
            </div>

        </>
    )
}


export default CheckOut;