import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./Footer";

interface Home
{
    state: string
    area: string
    pincode: string
}

interface order
{
    _id: string
    billamt: number
    email: string
    indiaDateTime: string
    PayMode: string
    status: string
    OrderDate: string
    address: Home
}

function ViewOrders()
{

    const [ordersdata, setordersdata] = useState<order[]>([]);
    const [date, setdate] = useState<string>("");
    const [pmode, setpmode] = useState<string>("");
    const [status, setstatus] = useState<string>("");
    const [billamt, setbillamt] = useState<number>(0);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1); //  for paging   , which page user is on
    const [itemsPerPage] = useState<number>(2); // how many rows per page

    async function fetchorders(e?: React.FormEvent<HTMLFormElement>)
    {
        if (e) e.preventDefault()
        try
        {
            var resp;
            if (status !== "" && pmode !== "")
            {
                resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/getallordersbydate?odate=${date}&pmode=${pmode}&status=${status}`);
            }
            else if (pmode !== "")
            {
                resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/getallordersbydate?odate=${date}&pmode=${pmode}`);
            }
            else if (status !== "")
            {
                resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/getallordersbydate?odate=${date}&status=${status}`);
            }
            else
            {
                resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/getallordersbydate?odate=` + date);
            }


            if (resp.data.statuscode === 1)
            {
                setordersdata(resp.data.ordersdata)
                setCurrentPage(1); // reset to page 1 whenever new data comes
            }
            else if (resp.data.statuscode === 0)
            {
                toast.info("No Order Found")
                setordersdata([]);
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


    async function onorderdel(id: string)
    {
        var userresp = window.confirm("Are you sure to Delete")

        if (userresp === true)
        {
            const resp = await axios.delete(`${import.meta.env.VITE_API_URL}/api/delorder/${id}`)
            if (resp.status === 200)
            {
                if (resp.data.statuscode === 1)
                {
                    toast.success("Order Deleted Successfull")
                    fetchorders();
                }
                else if (resp.data.statuscode === 0)
                {
                    toast.error("Order not Deleted")
                }
            }
            else
            {
                toast.error("Some Problem Occured")
            }
        }
    }

    useEffect(() =>
    {
        if (ordersdata)
        {
            var gtotal = 0;
            for (var x = 0; x < ordersdata.length; x++) 
            {
                gtotal = gtotal + ordersdata[x].billamt;
            }
            setbillamt(gtotal);
        }
    }, [ordersdata])

    useEffect(() =>
    {
        const data = sessionStorage.getItem("userdata")
        if (!data)
        {
            navigate("/login")
            toast.error("please login to access the page")
        }
        else
        {
            var uinfo = JSON.parse(data)
            if (uinfo.usertype !== "admin")
            {
                navigate("/login")
                toast.error("please login to access the admin page")
            }
        }
    }, [])

    // async function updatestatus(id: string)
    // {
    //     navigate("/updatestatus?oid=" + id)
    // }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = ordersdata.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(ordersdata.length / itemsPerPage);

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
                    <form name="form1" onSubmit={fetchorders}>
                        Choose Date <input type="date" name="odate" onChange={(e) => setdate(e.target.value)} />&nbsp;&nbsp;&nbsp;

                        <select name="pmode" onChange={(e) => setpmode(e.target.value)} >
                            <option value="">Choose Payment Mode</option>
                            <option value="Cash on Delivery">Cash on Deleivery</option>
                            <option value="Debit Card / Credit Card">Card</option>
                        </select>&nbsp;&nbsp;&nbsp;

                        <select name="status" onChange={(e) => setstatus(e.target.value)}>
                            <option value="">Choose Status</option>
                            <option value="Payment received, processing">Payment received</option>
                            <option>Confirmed</option>
                            <option>Shipped</option>
                            <option>In-Transit</option>
                            <option>Out for Delivery</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                            <option>Returned</option>
                        </select>&nbsp;&nbsp;&nbsp;

                        <input type="submit" name="btn" value="Show Orders" className="btn btn-primary" ></input>

                    </form>
                    {
                        ordersdata.length > 0 ?
                            <>
                                <br /><br /><h2>List Of All Orders</h2><br />
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
                                        currentItems.map((item, index) =>
                                        {

                                            const indiaDateTime = new Date(item.OrderDate).toLocaleString("en-IN", {
                                                // timeZone: "UTC", if 5:30 hrs are added in database
                                                timeZone: "Asia/Kolkata",  // if 5:30 hrs are not added in database
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                            });
                                            return (
                                                <tr key={index}>
                                                    <td><Link to={`/vieworderitems?oid=${item._id}`}>{item._id}</Link></td>
                                                    <td>{item.address.state}</td>
                                                    <td>{item.address.area}</td>
                                                    <td>{item.address.pincode}</td>
                                                    <td>{item.billamt}</td>
                                                    <td>{item.email}</td>
                                                    <td>{indiaDateTime}</td>
                                                    <td>{item.PayMode}</td>
                                                    <td>{item.status}</td>
                                                    <td><button className="btn btn-danger" onClick={() => navigate(`/updatestatus?oid=${item._id}&currst=${item.status}`)}>Update</button></td>
                                                    {/* <td><button className="btn btn-danger" onClick={() => updatestatus(item._id)}>Update</button></td> */}
                                                    <td><button className="btn btn-danger" onClick={() => onorderdel(item._id)}>Delete</button></td>
                                                </tr>
                                            )
                                        }
                                        )
                                    }
                                </table><br /><br />
                                {ordersdata.length} orders found<br />
                                Rs.{billamt}/- is total bill <br /><br />

                                {/* ✅ Pagination controls */}
                                <div className="pagination">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        className="btn btn-secondary"
                                    >
                                        Prev
                                    </button>
                                    <span style={{ margin: "0 10px" }}>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        className="btn btn-secondary"
                                    >
                                        Next
                                    </button>
                                </div>

                            </> : null
                    }
                </div>
            </div>
            <Footer />
        </>
    )
}
export default ViewOrders;











