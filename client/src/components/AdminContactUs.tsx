import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./Footer";


function AdminContactUs()
{
    const navi = useNavigate()

    useEffect(() =>
    {
        document.title = "Admin Contact Us"
    }, [])

    useEffect(() =>
    {
        const data = sessionStorage.getItem("userdata")
        if (!data) 
        {
            navi("/login")
            toast.error("please login to access the page")
        }
        else
        {
            const uinfo = JSON.parse(data)
            if (uinfo.usertype !== "admin")
            {
                navi("/login")
                toast.error("please login to access the admin page")
            }
        }
    }, [])

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/adminhome"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Contact-Us</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">
                    <h2>Contact On Email</h2>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default AdminContactUs;