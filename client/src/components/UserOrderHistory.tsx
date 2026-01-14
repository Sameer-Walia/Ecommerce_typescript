import axios from "axios";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import type { Rootstate } from "../store";
import Footer from "./Footer";

interface Order
{
    _id: string
    billamt: number
    email: string
    PayMode: string
    status: string
    address: Location
    OrderDate: string
}

interface Location
{
    state: string
    area: string
    pincode: string
}


function UserOrderHistory() 
{
    const { email } = useSelector((state: Rootstate) => state.auth)
    const [ordersdata, setordersdata] = useState<Order[]>([]);
    const navigate = useNavigate();
    async function fetchorders()
    {
        try
        {
            const resp = await axios.get<{ statuscode: number; ordersdata?: Order[] }>(`${import.meta.env.VITE_API_URL}/api/getuserorders?un=` + email)

            if (resp.data.statuscode === 1 && resp.data.ordersdata)
            {
                setordersdata(resp.data.ordersdata)
            }
            else if (resp.data.statuscode === 0)
            {
                setordersdata([]);
            }
            else
            {
                toast.error("Some error occured")
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
            fetchorders();
        }
    }, [email])

    useEffect(() =>
    {
        if (sessionStorage.getItem("userdata") === null)
        {
            navigate("/login")
            toast.error("please login to access the page")
        }
    }, [])


    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">List of Orders</li>
                    </ol>
                </div>
            </div>
            <div className="login">
                <div className="containersam">
                    {
                        ordersdata.length > 0 ?
                            <>
                                <h2>List of Orders</h2><br />
                                <table className="timetable_sub">
                                    <tbody>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>State</th>
                                            <th>Address</th>
                                            <th>Pincode</th>
                                            <th>Bill Amount</th>
                                            <th>Email</th>
                                            <th>Date</th>
                                            <th>Payment Mode</th>
                                            <th>Status</th>
                                        </tr>
                                    </tbody>
                                    {
                                        ordersdata.map((item, index) =>
                                            <tr key={index}>
                                                <td><Link to={`/vieworderitems?oid=${item._id}`}>{item._id}</Link></td>
                                                <td>{item.address.state}</td>
                                                <td>{item.address.area}</td>
                                                <td>{item.address.pincode}</td>
                                                <td>{item.billamt}</td>
                                                <td>{item.email}</td>
                                                <td> {new Date(item.OrderDate).toLocaleString("en-IN", {
                                                    timeZone: "Asia/Kolkata",
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}</td>
                                                <td>{item.PayMode}</td>
                                                <td>{item.status}</td>
                                            </tr>
                                        )
                                    }
                                </table><br />
                                {ordersdata.length} orders found
                            </> : <h2>No orders found</h2>
                    }
                </div>
            </div>
            <Footer />
        </>
    )
}
export default UserOrderHistory