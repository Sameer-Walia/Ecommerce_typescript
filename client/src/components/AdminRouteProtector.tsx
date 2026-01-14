import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

interface AdminRouteProtectorProps
{
    compname: React.ComponentType;
}


function AdminRouteProtector({ compname: Component }: AdminRouteProtectorProps)
{

    const navigate = useNavigate()

    useEffect(() =>
    {
        const data = sessionStorage.getItem("userdata")
        if (!data)
        {
            toast.error("Please login to access the page");
            navigate("/login");
        }
        else
        {
            const user = JSON.parse(data)
            if (user.usertype !== "admin")
            {
                toast.error("Please login to access the Adminpage");
                navigate("/login");
            }
        }
    }, [])

    return (
        <div>
            <Component />
        </div>
    )
}

export default AdminRouteProtector
