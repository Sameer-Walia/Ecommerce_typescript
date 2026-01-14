import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./Footer";

interface CategoryData
{
    catname: string;
    _id: string;
}

interface SubCategoryData
{
    _id: string;
    subcatname: string;
    subcatpic: string;
    catid: CategoryData;
}

function ManageSubCategory()
{

    const [subcatname, setsubcatname] = useState<string>("");
    const [subcatdata, setsubcatdata] = useState<SubCategoryData[]>([]);
    const [catid, setcatid] = useState<string>("");
    const [subcatid, setsubcatid] = useState<string>("");
    const [catdata, setcatdata] = useState<CategoryData[]>([]);
    const [picture, setpicture] = useState<File | null>(null);
    const [edit, setedit] = useState<boolean>(false)
    const [imgname, setimgname] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navi = useNavigate();
    const [loading, setloading] = useState<boolean>(false);

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

    useEffect(() =>
    {
        document.title = "Manage Sub Category";
    }, []);

    useEffect(() =>
    {
        fetchallcat();
    }, [])

    async function fetchallcat()  
    {
        try
        {
            const resp = await axios.get<{ statuscode: number; categorydata?: CategoryData[] }>(`${import.meta.env.VITE_API_URL}/api/getallcat`, { withCredentials: true })

            if (resp.data.statuscode === 1 && resp.data.categorydata)
            {
                setcatdata(resp.data.categorydata)
            }
            else if (resp.data.statuscode === 0)
            {
                setcatdata([]);
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
    }

    useEffect(() =>
    {
        if (catid && edit === false)
        {
            fetchsubcatbycat()
        }
    }, [catid])

    async function fetchsubcatbycat()
    {
        try
        {
            const resp = await axios.get<{ statuscode: number; subcatalldata?: SubCategoryData[] }>(`${import.meta.env.VITE_API_URL}/api/fetchsubcatbycatid?cid=${catid}`, { withCredentials: true })

            if (resp.data.statuscode === 1 && resp.data.subcatalldata)
            {
                setsubcatdata(resp.data.subcatalldata)
            }
            else if (resp.data.statuscode === 0)
            {
                setsubcatdata([]);
                toast.info("No subcategory found");
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

    async function addsubcategory(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault()
        try
        {
            if (edit === false) 
            {
                setloading(true);
                const fdata = new FormData();
                fdata.append("catid", catid)
                fdata.append("subcatname", subcatname)

                if (picture !== null)
                {
                    fdata.append("picture", picture)
                }

                const resp = await axios.post<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/addsubcategory`, fdata, { withCredentials: true })

                if (resp.data.statuscode === 1)
                {
                    toast.success("Sub Category added successfully");
                    fetchsubcatbycat();
                    canceldb();
                }
                else if (resp.data.statuscode === 0)
                {
                    toast.warn("Sub Category not added ");
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
        setsubcatname("")
        setpicture(null)
        if (fileInputRef.current) 
        {
            fileInputRef.current.value = '';
        }
    }

    async function ondelete(catid: string)
    {
        try
        {
            var pass = window.confirm("Are you sure to Delete")
            if (pass === true)
            {
                setloading(true);
                const resp = await axios.delete<{ statuscode: number; msg?: string }>(`${import.meta.env.VITE_API_URL}/api/delsubcat?id=${catid}`, { withCredentials: true })

                if (resp.data.statuscode === 1)
                {
                    toast.success(resp.data.msg)
                    fetchsubcatbycat();
                    canceldb();
                }
                else if (resp.data.statuscode === 0)
                {
                    toast.warn(resp.data.msg)
                }
                else
                {
                    toast.error("some problem occured")
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

    function onupdate(subcatitem: SubCategoryData)
    {
        setedit(true)
        setsubcatname(subcatitem.subcatname)
        setimgname(subcatitem.subcatpic)
        setsubcatid(subcatitem._id)
        // setcatid(subcatitem.catid)  // if u want to change category of product
    }

    async function updatedb()
    {
        try
        {
            setloading(true);
            const formdata = new FormData();
            formdata.append("usubname", subcatname)  //either old name or new name
            formdata.append("subcatid", subcatid)  // unique id
            formdata.append("cid", catid)  // if u want to change category of product
            formdata.append("oldpicname", imgname)

            if (picture !== null)
            {
                formdata.append("upsubpic", picture)
            }

            const resp = await axios.put<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/updatesubcategory`, formdata, { withCredentials: true })

            if (resp.data.statuscode === 1)
            {
                toast.success("Sub Category Updated Successfully")
                fetchsubcatbycat()
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
                        <li className="active ">Manage Sub-Category</li>
                    </ol>
                </div>
            </div>


            <div className="login">
                <div className="container">
                    <h2>Manage Sub Category</h2>

                    <div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">

                        <form name="form1" onSubmit={addsubcategory}>

                            <select name="subcat" value={catid} className="form-control" onChange={(e) => setcatid(e.target.value)} >
                                <option value="">Choose Category</option>
                                {
                                    catdata.length > 0 ?
                                        catdata.map((item, index) =>
                                            <option value={item._id} key={index}>{item.catname}</option>
                                        ) : null
                                }
                            </select>
                            <input type="text" name="prodname" value={subcatname} placeholder="Sub Category Name" required onChange={(e) => setsubcatname(e.target.value)} />
                            {
                                edit === true ?
                                    <>
                                        <img src={`${import.meta.env.VITE_API_URL}/uploads/${imgname}`} height="100" />
                                        Choose new image, if required<br /><br />
                                    </> : null
                            }

                            <input type="file" accept="image/*" name="ppic" ref={fileInputRef} onChange={(e) => setpicture(e.target.files ? e.target.files[0] : null)} /><br />

                            {
                                edit === false ?
                                    <>
                                        {
                                            loading ?
                                                <div className="loader-container">
                                                    <img src="images/loader.gif" alt="loader" className="loader" />
                                                </div> : <input type="submit" name="btn1" value="Add Sub Category" />
                                        }
                                    </> : null
                            }
                            {
                                edit === true ?
                                    <>
                                        {
                                            loading ?
                                                <div className="loader-container">
                                                    <img src="images/loader.gif" alt="loader" className="loader" />
                                                </div> : <input type="button" name="btn2" value="Update" onClick={updatedb} />
                                        }
                                        <input type="button" name="btn3" value="Cancel" onClick={canceldb} />
                                    </> : null
                            }

                        </form>
                    </div>

                </div>
            </div>


            <div className="login">
                <div className="container">
                    {
                        subcatdata.length > 0 ?
                            <>
                                <h2>Added Sub Categories</h2><br />
                                <table className="table table-striped timetable_sub ">
                                    <tbody >
                                        <tr >
                                            <th>Pic</th>
                                            <th>Category Name</th>
                                            <th>Sub Category Name</th>
                                            <th>Update</th>
                                            <th>Delete</th>
                                        </tr>
                                    </tbody>
                                    {
                                        subcatdata.map((item, index) =>
                                            <tr key={index} >
                                                <td><img src={`${import.meta.env.VITE_API_URL}/uploads/${item.subcatpic}`} height="75" /></td>
                                                <td >{item.catid.catname}</td>
                                                <td >{item.subcatname}</td>
                                                <td><button className="btn btn-primary" onClick={() => onupdate(item)}>Update</button></td>
                                                <td><button className="btn btn-danger" onClick={() => ondelete(item._id)}>Delete</button></td>
                                            </tr>
                                        )
                                    }
                                </table><br /><br />
                                {subcatdata.length} Products found
                            </> : null
                    }
                </div>
            </div>
            <br /><br /> <Footer />
        </>

    )
}
export default ManageSubCategory;