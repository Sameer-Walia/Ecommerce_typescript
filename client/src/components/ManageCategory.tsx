import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./Footer";

interface CategoryData
{
    catpic: string;
    catname: string;
    _id: string;
}

function ManageCategory()
{

    const [catname, setcatname] = useState<string>("");
    const [catpic, setcatpic] = useState<File | null>(null);
    const [msg, setmsg] = useState<string>("");
    const [picname, setpicname] = useState<string>("");
    const [catid, setcatid] = useState<string>("");
    const [edit, setedit] = useState<boolean>(false);
    const [loading, setloading] = useState<boolean>(false);

    const [catdata, setcatdata] = useState<CategoryData[]>([]);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() =>
    {
        document.title = "Manage Category";
    }, []);

    useEffect(() =>
    {
        fetchallcat();
    }, [])

    async function fetchallcat()
    {
        try
        {
            setloading(true);
            const resp = await axios.get<{ statuscode: number; categorydata?: CategoryData[] }>(`${import.meta.env.VITE_API_URL}/api/getallcat`, { withCredentials: true })

            if (resp.data.statuscode === 1 && resp.data.categorydata)
            {
                setcatdata(resp.data.categorydata)
            }
            else if (resp.data.statuscode === 0)
            {
                setcatdata([]);
                toast.error("No Categories found")
            }
            else
            {
                toast.error("Some Problem Occured , try again")
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

    async function addcat(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault()
        try
        {
            if (edit === false)  
            {
                setloading(true);
                const fdata = new FormData();
                fdata.append("cname", catname)
                if (catpic)
                {
                    fdata.append("cpic", catpic)
                }

                const resp = await axios.post<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/savecategory`, fdata, { withCredentials: true })

                if (resp.data.statuscode === 1)
                {
                    toast.success("Category added successfully");
                    fetchallcat();
                    canceldb();
                }
                else if (resp.data.statuscode === 0)
                {
                    setmsg("Category not added");
                }
                else
                {
                    toast.error("Some Problem Occured")
                }
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

    function canceldb()
    {
        setedit(false)
        setcatpic(null);
        setcatname("");
        setcatid("")
        setpicname("")
        setmsg("");
        if (fileInputRef.current)
        {
            fileInputRef.current.value = "";
        }
    }

    function onupdate(catitem: CategoryData)
    {
        setedit(true)
        setcatname(catitem.catname)
        setpicname(catitem.catpic)
        setcatid(catitem._id)
    }

    async function updatedb()
    {
        try
        {
            const formdata = new FormData();
            formdata.append("upname", catname)  //either old name or new name

            if (catpic !== null)
            {
                formdata.append("uppic", catpic)
            }
            formdata.append("oldpicname", picname)
            formdata.append("cid", catid)

            const resp = await axios.put<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/updatecategory`, formdata, { withCredentials: true })

            if (resp.data.statuscode === 1)
            {
                toast.success("Category Updated Successfully")
                fetchallcat();
                canceldb();
            }
            else if (resp.data.statuscode === 0)
            {
                toast.warn("Category not updated");
            }
            else
            {
                toast.error("some error occured")
            }
        }
        catch (e: any)
        {
            toast.error("Error Occured " + e.message)
        }

    }

    async function ondelete(catid: string)
    {
        try
        {
            var pass = window.confirm("Are you sure to Delete")
            if (pass === true)
            {
                const resp = await axios.delete<{ statuscode: number; msg?: string }>(`${import.meta.env.VITE_API_URL}/api/delcat?id=${catid}`, { withCredentials: true })

                if (resp.data.statuscode === 1)
                {
                    toast.success(resp.data.msg)
                    fetchallcat();
                    canceldb();
                }
                else if (resp.data.statuscode === 0)
                {
                    toast.warn(resp.data.msg)
                }
                else
                {
                    alert("some problem occured")
                }
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
                        <li className="active">Manage Category</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">
                    <h2>Manage Category</h2>

                    <div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">

                        <form name="form1" onSubmit={addcat}>
                            <input type="text" name="catname" value={catname} placeholder="Category Name" required onChange={(e) => setcatname(e.target.value)} /><br />
                            {
                                edit === true ?
                                    <>
                                        <img src={`${import.meta.env.VITE_API_URL}/uploads/${picname}`} height="100" />
                                        Choose new image, if required<br /><br />
                                    </> : null
                            }

                            <input type="file" accept="image/*" name="catpic" ref={fileInputRef} onChange={(e) => setcatpic(e.target.files ? e.target.files[0] : null)} />
                            {
                                edit === false ?
                                    <>
                                        {
                                            loading ?
                                                <div className="loader-container">
                                                    <img src="images/loader.gif" alt="loader" className="loader" />
                                                </div> : <input type="submit" name="btn" value="Add" />
                                        }
                                    </> : null
                            }
                            {
                                edit === true ?
                                    <>
                                        <input type="button" name="btn" value="Update" onClick={updatedb} />
                                        <input type="button" name="btn" value="Cancel" onClick={canceldb} />
                                    </> : null
                            }
                            {msg}
                        </form>
                    </div>

                </div>
            </div>

            <div className="login">
                <div className="container">
                    {
                        catdata.length > 0 ?
                            <>
                                <h2>Added Categories</h2><br />
                                <table className="table table-striped timetable_sub ">
                                    <tbody >
                                        <tr >
                                            <th>Pic</th>
                                            <th>Category Name</th>
                                            <th>Update</th>
                                            <th>Delete</th>
                                        </tr>
                                    </tbody>
                                    {
                                        catdata.map((item, index) =>
                                            <tr key={index} >
                                                <td><img src={`${import.meta.env.VITE_API_URL}/uploads/${item.catpic}`} height="75" /></td>
                                                <td >{item.catname}</td>
                                                <td><button className="btn btn-primary" onClick={() => onupdate(item)}>Update</button></td>
                                                <td><button className="btn btn-danger" onClick={() => ondelete(item._id)}>Delete</button></td>
                                            </tr>
                                        )
                                    }
                                </table><br /><br />
                                {catdata.length} Products found
                            </> : <h2>No Category Found</h2>
                    }
                </div>
            </div>
            <br /><br /><br /><Footer />
        </>

    )
}
export default ManageCategory;