import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify";
import Footer from "./Footer";

interface OrderItems
{
    Picture: string;
    ProdName: string;
    Rate: string;
    Qty: string;
    TotalCost: number;
}

function OrderItems()
{
    const [orderitems, setorderitems] = useState<OrderItems[]>([]);

    const [params] = useSearchParams();
    const orderid = params.get("oid");
    const [billamt, setbillamt] = useState<number>(0);

    async function fetchorderproducts()
    {
        try
        {
            const resp = await axios.get<{ statuscode: number; items?: OrderItems[] }>(`${import.meta.env.VITE_API_URL}/api/getorderproducts?orderno=` + orderid)

            if (resp.data.statuscode === 1 && resp.data.items)
            {
                setorderitems(resp.data.items)
            }
            else if (resp.data.statuscode === 0)
            {
                setorderitems([]);
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
        fetchorderproducts();
    }, [])

    useEffect(() =>
    {
        // 0+76,0+765,0+456 ans will be 456(last one) in asynchronous function
        var gtotal = 0;
        for (var x = 0; x < orderitems.length; x++) // it is synchronous function
        {
            gtotal = gtotal + orderitems[x].TotalCost;
        }
        setbillamt(gtotal);
    }, [orderitems])

    useEffect(() =>
    {
        document.title = "Order Items"
    }, [])

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Order Products</li>
                    </ol>
                </div>
            </div>
            <div className="login">
                <div className="container">
                    {
                        orderitems.length > 0 ?
                            <>
                                <h2>Order Products</h2><br />
                                <table className="timetable_sub">
                                    <tbody>
                                        <tr>
                                            <th>Picture</th>
                                            <th>Name</th>
                                            <th>Rate</th>
                                            <th>Quantity</th>
                                            <th>Total Cost</th>
                                        </tr>
                                    </tbody>
                                    {
                                        orderitems.map((item, index) =>
                                            <tr key={index}>
                                                <td><img src={`${import.meta.env.VITE_API_URL}/uploads/${item.Picture}`} height='75' /></td>
                                                <td>{item.ProdName}</td>
                                                <td>{item.Rate}</td>
                                                <td>{item.Qty}</td>
                                                <td>{item.TotalCost}</td>
                                            </tr>
                                        )
                                    }
                                </table><br />
                                Rs.{billamt}/- is total bill <br /><br />
                            </> : <h2>No items found</h2>
                    }
                </div>
            </div><br /><br />
            <Footer />
        </>
    )
}
export default OrderItems