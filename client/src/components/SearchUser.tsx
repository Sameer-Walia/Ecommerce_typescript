import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./Footer";

interface User
{
    name: string;
    phone: string;
    email: string;
}

interface SearchResponse
{
    statuscode: number;
    searchdata?: User;
    msg?: string;
}

function SearchUser() 
{

    const [name, setname] = useState<string>("");
    const [msg, setmsg] = useState<string>("");
    const [flag, setflag] = useState<boolean>(false);
    const [udata, setudata] = useState<User | null>(null);

    const navi = useNavigate();

    async function search(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault()
        try
        {
            const resp = await axios.get<SearchResponse>(`${import.meta.env.VITE_API_URL}/api/searchuser?un=${name}`, { withCredentials: true });

            if (resp.data.statuscode === 0)
            {
                toast.warning("No User Found");
                setflag(false)
                setudata(null);
            }
            else if (resp.data.statuscode === 1 && resp.data.searchdata)
            {
                setmsg("")
                setflag(true)
                setudata(resp.data.searchdata)
            }
            else if (resp.data.statuscode === -5)
            {
                toast.error(resp.data.msg)
                navi("/login")
            }
            else
            {
                toast.warn("Some Problem Occured")
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
                        <li className="active">Search User</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">
                    <h2>Search User</h2>

                    <div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">
                        <form name="form1" onSubmit={search}>
                            <input type="email" name="un" placeholder="Email Address(username)" required onChange={(e) => setname(e.target.value)} />
                            <input type="submit" name="btn" value="Search" /><br /><br />
                            {msg}
                        </form>
                        {
                            flag === true && udata && (
                                <>
                                    <b>Name:-</b>{udata.name}<br />
                                    <b>Phone:-</b>{udata.phone}<br />
                                    <b>Email:-</b>{udata.email}<br />
                                </>
                            )
                        }
                    </div>
                    <h4>For New People</h4>

                    <p><Link to="/signup">Register Here</Link> (Or) go back to <Link to="/">Home</Link><span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span></p>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default SearchUser;