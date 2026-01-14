import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./Footer";

interface members
{
    name: string;
    phone: string;
    email: string;
    _id: string;
}

interface oneuser
{
    name: string;
    phone: string;
    email: string;
}

function UsersList()
{
    const [membersdata, setmembersdata] = useState<members[]>([]);
    const [name, setname] = useState<string>("");
    const [phone, setphone] = useState<string>("");
    const [email, setemail] = useState<string>("");
    const [userid, setuserid] = useState<string>("");
    const [showoneuser, setshowoneuser] = useState<boolean>(false)
    const [loading, setloading] = useState<boolean>(false);

    const navi = useNavigate()

    async function fetchUsers()
    {
        try
        {
            const resp = await axios.get<{ statuscode: number; usersdata?: members[]; msg?: string }>(`${import.meta.env.VITE_API_URL}/api/getallusers`, { withCredentials: true });

            if (resp.data.statuscode === 1 && resp.data.usersdata)
            {
                setmembersdata(resp.data.usersdata)
            }
            else if (resp.data.statuscode === 0)
            {
                setmembersdata([]);
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

    useEffect(() =>
    {
        document.title = "Users-List"
    }, [])

    useEffect(() =>
    {
        fetchUsers();
    }, [])

    async function onmemdel(id: string)
    {
        const userresp = window.confirm("Are you sure to Delete")

        if (userresp === true)
        {
            const resp = await axios.delete<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/deluser/${id}`, { withCredentials: true })

            if (resp.data.statuscode === 1)
            {
                toast.success("User Deleted Successfull")
                fetchUsers()
            }
            else if (resp.data.statuscode === 0)
            {
                toast.error("User not Deleted")
            }
            else
            {
                toast.error("Some Problem Occured")
            }
        }
    }

    async function fetchoneuserdetails(id: string)
    {
        setshowoneuser(true)
        setuserid(id)
        const resp = await axios.get<{ statuscode: number; oneuserdata: oneuser }>(`${import.meta.env.VITE_API_URL}/api/fetchoneuser/${id}`, { withCredentials: true })

        if (resp.data.statuscode === 1)
        {
            setname(resp.data.oneuserdata.name)
            setphone(resp.data.oneuserdata.phone)
            setemail(resp.data.oneuserdata.email)
        }
        else if (resp.data.statuscode === 0)
        {
            toast.error("User not Found")
        }
        else
        {
            toast.error("Some Problem Occured")
        }
    }

    async function updateoneuser(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault()
        setloading(true)
        try
        {
            const data = { userid, name, phone, email }
            const resp = await axios.put<{ statuscode: number; msg?: string }>(`${import.meta.env.VITE_API_URL}/api/updateoneuser`, data, { withCredentials: true })

            if (resp.data.statuscode === 1)
            {
                toast.success("User Profile Updated ")
                fetchUsers()
                setshowoneuser(false)
            }
            else if (resp.data.statuscode === 0)
            {
                toast.error("User Profile Not Updated ")
            }
            else if (resp.data.statuscode === -5)
            {
                toast.error(resp.data.msg)
                navi("/login")
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
        finally
        {
            setloading(false)
        }

    }

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">UsersList</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">
                    {
                        membersdata.length > 0 ?
                            <>
                                <h2>List Of Users</h2><br />
                                <table className="table table-striped timetable_sub">
                                    <tbody>
                                        <tr>
                                            <th>Name</th>
                                            <th>Phone</th>
                                            <th>Username</th>
                                            <th>Update</th>
                                            <th>Delete</th>
                                        </tr>
                                    </tbody>
                                    {
                                        membersdata.map((item, index) =>
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.phone}</td>
                                                <td>{item.email}</td>
                                                <td><button className="btn btn-primary" onClick={() => fetchoneuserdetails(item._id)}>Update</button></td>
                                                <td><button className="btn btn-danger" onClick={() => onmemdel(item._id)}>Delete</button></td>
                                            </tr>
                                        )
                                    }

                                </table><br /><br />
                                {membersdata.length} members found
                            </> : <h2>No User Found</h2>
                    }
                </div>
            </div>
            {
                showoneuser === true ?
                    <div className="login">
                        <div className="container">
                            <h2>Update User</h2>
                            <div className="login-form-grids">
                                <form name="form1" onSubmit={updateoneuser}>
                                    <input type="text" name="pname" placeholder="First Name..." value={name} required minLength={3} onChange={(e) => setname(e.target.value)} /><br />

                                    <input type="tel" name="phone" placeholder="Phone..." value={phone} required minLength={10} maxLength={10} onChange={(e) => setphone(e.target.value)} /><br />

                                    <input type="email" name="un" placeholder="Email Address(Username)" value={email + " (ask admin to change)"} required onChange={(e) => setemail(e.target.value)} readOnly disabled />

                                    {
                                        loading ?
                                            <div className="loader-container">
                                                <img src="images/loader.gif" alt="loader" className="loader" />
                                            </div> : <input type="submit" name="btn" value="Update User" />
                                    }
                                </form>
                            </div>
                        </div>
                    </div> : null
            }<br /><br />

            <Footer />
        </>
    )
}
export default UsersList;