import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Rootstate } from "../store";
import Footer from "./Footer";

interface Cart
{
    Picture: string
    ProdName: string
    Rate: number
    Qty: number
    TotalCost: number
    _id: string
}

function ShowCart()
{
    const { email } = useSelector((state: Rootstate) => state.auth)

    const [cartdata, setcartdata] = useState<Cart[]>([]);
    const navigate = useNavigate();
    const [billamt, setbillamt] = useState<number>(0);

    async function fetchcart()
    {
        try
        {
            const resp = await axios.get<{ statuscode: number; cartinfo?: Cart[] }>(`${import.meta.env.VITE_API_URL}/api/getcart?un=${email}`,)

            if (resp.data.statuscode === 1 && resp.data.cartinfo)
            {
                setcartdata(resp.data.cartinfo)
                sessionStorage.setItem("cartdata", JSON.stringify(resp.data.cartinfo));
            }
            else if (resp.data.statuscode === 0)
            {
                setcartdata([]);
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
        if (email)
        {
            fetchcart();
        }
    }, [email])


    useEffect(() =>
    {
        // 0+76,0+765,0+456 ans will be 456(last one) in asynchronous function
        var gtotal = 0;
        for (var x = 0; x < cartdata.length; x++) // it is synchronous function
        {
            gtotal = gtotal + cartdata[x].TotalCost;
        }
        setbillamt(gtotal);

    }, [cartdata])

    useEffect(() =>
    {
        if (sessionStorage.getItem("userdata") === null)
        {
            navigate("/login")
            toast.error("please login to access the page")
        }
    }, [])



    async function ondel(id: string)
    {
        const userresp = window.confirm("Are you sure to Delete")

        if (userresp === true)
        {
            const resp = await axios.delete<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/delproduct/${id}`)

            if (resp.data.statuscode === 1)
            {
                toast.success("Product Deleted Successfull")
                fetchcart();
            }
            else if (resp.data.statuscode === 0)
            {
                toast.error("Product not Deleted")
            }
            else
            {
                toast.error("Some Problem Occured")
            }
        }
    }

    function oncheckout()
    {
        if (!billamt) return;
        sessionStorage.setItem("tbill", billamt.toString());
        navigate("/checkout")
    }

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">ShowCart</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">
                    {
                        cartdata.length > 0 ?
                            <>
                                <h2>List Of Products</h2><br />
                                <table className="table table-striped timetable_sub">
                                    <tbody>
                                        <tr>
                                            <th>Picture</th>
                                            <th>Name</th>
                                            <th>Rate</th>
                                            <th>Quantity</th>
                                            <th>Total Cost</th>
                                            <th>Delete</th>
                                        </tr>
                                    </tbody>
                                    {
                                        cartdata.map((item, index) =>
                                            <tr key={index}>
                                                <td><img src={`${import.meta.env.VITE_API_URL}/uploads/${item.Picture}`} height="75"></img></td>
                                                <td>{item.ProdName}</td>
                                                <td>{item.Rate}</td>
                                                <td>{item.Qty}</td>
                                                <td>{item.TotalCost}</td>
                                                <td><button className="btn btn-danger" onClick={() => ondel(item._id)}>Delete</button></td>
                                            </tr>
                                        )
                                    }
                                </table><br /><br />
                                <b>{cartdata.length} item(s) available in your cart</b><br /><br />
                                Rs.{billamt}/- is your total bill <br /><br />
                                <button name="btn" className="btn btn-primary" onClick={oncheckout}>Checkout</button>
                            </> : <h2>No Product Found</h2>
                    }
                </div>
            </div>
            <br /><br /><Footer />
        </>
    )
}
export default ShowCart;