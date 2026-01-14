import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { Rootstate } from "../store";

interface Address
{
    house: string;
    area: string;
    city: string;
    state: string;
}

interface Oinfo
{
    _id: string;
    address: Address;
}

function OrderSummary()
{
    const { email, name } = useSelector((state: Rootstate) => state.auth)

    const [orderinfo, setorderinfo] = useState<Oinfo | null>(null);
    const [loading, setloading] = useState<boolean>(false);
    const navi = useNavigate()
    async function fetchorderid()
    {
        try
        {
            setloading(true)
            const resp = await axios.get<{ statuscode: number; orderdata?: Oinfo }>(`${import.meta.env.VITE_API_URL}/api/getorderid?un=${email}&name=${name}`)

            if (resp.data.statuscode === 1 && resp.data.orderdata)
            {
                setorderinfo(resp.data.orderdata);
                toast.success("Order Details sent Successfully on Mail")
            }
            else if (resp.data.statuscode === 0)
            {
                toast.error("Error while fetching details")
            }
            else if (resp.data.statuscode === 2)
            {
                toast.error("Error while sending Order Details on Mail")
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
        finally
        {
            setloading(false)
        }
    }

    useEffect(() =>
    {
        if (email)
        {
            fetchorderid();
        }
    }, [email])

    useEffect(() =>
    {
        if (sessionStorage.getItem("userdata") === null)
        {
            navi("/login")
            toast.error("please login to access the page")
        }
    }, [])

    useEffect(() =>
    {
        document.title = "Order Summary"
    }, [])


    return (
        <>
            <div className="login">
                <div className="container">
                    {
                        loading ? <><img src="images/loader.gif" alt="loader" className="loader" /></> : null
                    }
                    {
                        orderinfo &&
                        <>
                            <h2>Thanks for shopping on our website. Your order number is :-<br />{orderinfo._id}</h2>
                            <h2>
                                Your Order will be delivered at :-<br />
                                {orderinfo.address.house}, {orderinfo.address.area}, {orderinfo.address.city}, {orderinfo.address.state}
                            </h2>
                        </>
                    }

                </div>
            </div>
        </>
    )
}
export default OrderSummary;