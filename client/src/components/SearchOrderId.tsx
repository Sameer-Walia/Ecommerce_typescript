import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./Footer";

interface Orderdata
{
    _id: string;
    billamt: number;
    email: string;
    OrderDate: string;
    PayMode: string;
    status: string;
    address: Location;
}

interface Location
{
    state: string
    area: string
    pincode: string
}


function SearchOrderId() 
{

    const [orderid, setorderid] = useState<string>("");
    const [orderdata, setorderdata] = useState<Orderdata[]>([]);
    const [billamt, setbillamt] = useState<number>(0)

    const navi = useNavigate();

    async function onsearch(e?: React.FormEvent<HTMLFormElement>)
    {
        if (e) e.preventDefault()
        try
        {
            const resp = await axios.get<{ statuscode: number; proddata?: Orderdata[] }>(`${import.meta.env.VITE_API_URL}/api/SearchOrderId?un=${orderid}`)

            if (resp.data.statuscode === 0)
            {
                toast.error("No Order-Id Found");
                setorderdata([])
            }
            else if (resp.data.statuscode === 1 && resp.data.proddata)
            {
                toast.success(" Order-Id Found");
                setorderdata(resp.data.proddata)
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
        // 0+76,0+765,0+456 ans will be 456(last one) in asynchronous function
        var gtotal = 0;
        for (var x = 0; x < orderdata.length; x++) // it is synchronous function
        {
            gtotal = gtotal + orderdata[x].billamt;
        }
        setbillamt(gtotal);

    }, [orderdata])

    async function onorderdel(id: string)
    {
        const userresp = window.confirm("Are you sure to Delete")

        if (userresp === true)
        {
            const resp = await axios.delete(`${import.meta.env.VITE_API_URL}/api/delorder/${id}`)

            if (resp.data.statuscode === 1)
            {
                toast.success("Order Deleted Successfull")
                onsearch();
            }
            else if (resp.data.statuscode === 0)
            {
                toast.warn("Order not Deleted")
            }
            else
            {
                toast.error("Some Problem Occured")
            }
        }
    }

    async function updatestatus(id: string, status: string)
    {
        navi(`/updatestatus?oid=${id}&currst=${status}`)
    }

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Order-Id</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">
                    <h2>Search Order-Id</h2>

                    <div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">
                        <form name="form1" onSubmit={onsearch}>
                            <input type="text" name="un" placeholder="Enter Order Id" required onChange={(e) => setorderid(e.target.value)} />
                            <input type="submit" name="btn" value="Search" /><br /><br />
                        </form>
                    </div><br /><br />
                    {
                        orderdata.length > 0 ?
                            <>
                                <h2>Order</h2><br />
                                <table className="table table-striped timetable_sub">
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
                                            <th>Update Status</th>
                                            <th>Delete</th>
                                        </tr>
                                    </tbody>
                                    {
                                        orderdata.map((item, index) =>
                                            <tr key={index}>
                                                <td><Link to={`/vieworderitems?oid=${item._id}`}>{item._id}</Link></td>
                                                <td>{item.address.state}</td>
                                                <td>{item.address.area}</td>
                                                <td>{item.address.pincode}</td>
                                                <td>{item.billamt}</td>
                                                <td>{item.email}</td>
                                                <td>{item.OrderDate}</td>
                                                <td>{item.PayMode}</td>
                                                <td>{item.status}</td>
                                                <td><button className="btn btn-danger" onClick={() => updatestatus(item._id, item.status)}>Update</button></td>
                                                <td><button className="btn btn-danger" onClick={() => onorderdel(item._id)}>Delete</button></td>
                                            </tr>
                                        )
                                    }
                                </table><br /><br />
                                {orderdata.length} orders found<br />
                                Rs.{billamt}/- is total bill <br /><br />
                            </> : null
                    }
                    <h4>For New People</h4>

                    <p><Link to="/signup">Register Here</Link> (Or) go back to <Link to="/">Home</Link><span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span></p>
                </div>
            </div><br /><br />
            <Footer />
        </>
    )
}
export default SearchOrderId;