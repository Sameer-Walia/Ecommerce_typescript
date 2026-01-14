import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface UserRouteProtectorProps
{
    compname: React.ComponentType
}

function UserRouteProtector({ compname: Component }: UserRouteProtectorProps)
{
    const navigate = useNavigate()

    useEffect(() =>
    {
        const data = sessionStorage.getItem("userdata")
        if (!data)
        {
            toast.error("Please login to access the page");
            navigate("/login");
            return;
        }
    }, [])

    return (
        <div>
            <Component />
        </div>
    )
}

export default UserRouteProtector
