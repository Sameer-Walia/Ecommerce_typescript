import axios from "axios";
import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify";
import Footer from "./Footer";
function UpdateStatus()
{
    const [newst, setnewst] = useState<string>("");
    const [params] = useSearchParams();
    const orderid = params.get("oid");
    const currstatus = params.get("currst");
    const navigate = useNavigate();
    async function onupdatestatus(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault();
        const updatedata = { newst, orderid };
        try
        {
            const resp = await axios.put(`${import.meta.env.VITE_API_URL}/api/updatestatus`, updatedata)

            if (resp.data.statuscode === 0)
            {
                toast.error("Error while updating status")
            }
            else if (resp.data.statuscode === 1)
            {
                toast.success("Status updated successfully")
                navigate("/vieworder");
            }
            else
            {
                toast.error("Some Problem occured");
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
                        <li className="active">Update Status</li>
                    </ol>
                </div>
            </div>
            <div className="login">
                <div className="container">
                    <h2>Update Status</h2>
                    <div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">
                        <form name="form1" onSubmit={onupdatestatus}>
                            <b>Current Status :- </b> {currstatus}<br /><br />
                            <select name="newstatus" className="form-control" onChange={(e) => setnewst(e.target.value)} required>
                                <option value="">Choose New Status</option>
                                <option>Confirmed</option>
                                <option>Shipped</option>
                                <option>In-Transit</option>
                                <option>Out for Delivery</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>
                                <option>Returned</option>
                            </select>
                            <input type="submit" name="btn" value="Update" /><br />
                        </form>
                    </div>
                </div>
            </div>
            <br /><br /><Footer />
        </>
    )
}
export default UpdateStatus