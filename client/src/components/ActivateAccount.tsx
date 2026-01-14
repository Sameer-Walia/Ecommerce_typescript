import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

function ActivateAccount()
{

    const [msg, setmsg] = useState<string>('')
    const [params] = useSearchParams();
    const activationCode = params.get("code")
    const navigate = useNavigate()

    useEffect(() => 
    {
        if (activationCode)
        {
            activateuseraccount(activationCode);
        }
    }, [activationCode])

    async function activateuseraccount(code: string) 
    {
        try 
        {
            const apidata = { code }
            const resp = await axios.put<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/activateuseraccount`, apidata)

            if (resp.data.statuscode === 1) 
            {
                toast.success("Account Activated Successfully , please login now");
                navigate("/login")
            }
            else if (resp.data.statuscode === 0) 
            {
                setmsg("Error while activating Account. May be u have already activated. U can directly Login now")
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

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/homepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Activate Account</li>
                    </ol>
                </div>
            </div>
            <div className="login">
                <div className="container">
                    <h2>{msg}</h2>
                </div>
            </div>
        </>
    )
}
export default ActivateAccount;