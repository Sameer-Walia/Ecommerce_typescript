import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Footer from "./Footer";


interface CategoryData
{
    catname: string;
    _id: string;
}

interface SubCategoryData
{
    subcatname: string;
    _id: string;
}

interface productdetails
{
    _id: string
    Picture: string;
    Name: string;
    Rate: string;
    Discount: string;
    Stock: string;
    Description: string;
    catid: CategoryData;
    subcatid: SubCategoryData;
    ExtraPicture: string[]
}

function ManageProduct()
{
    const [catdata, setcatdata] = useState<CategoryData[]>([]);
    const [subcatdata, setsubcatdata] = useState<SubCategoryData[]>([]);
    const [subcatid, setsubcatid] = useState<string>("");
    const [catid, setcatid] = useState<string>("");
    const [edit, setedit] = useState<boolean>(false)
    const [pname, setpname] = useState<string>("");
    const [rate, setrate] = useState<string>("");
    const [dis, setdis] = useState<string>("");
    const [stock, setstock] = useState<string>("");
    const [descp, setdescp] = useState<string>("");
    const [picture, setpicture] = useState<File | null>(null);
    const [multiplepicture, setmultiplepicture] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const fileInputRef2 = useRef<HTMLInputElement | null>(null);
    const [productdata, setproductdata] = useState<productdetails[]>([]);
    const [imgname, setimgname] = useState<string>("");
    const [prodid, setprodid] = useState<string>("");
    const [mulimgname, setmulimgname] = useState<string[]>([]);


    const navi = useNavigate()

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
        document.title = "Manage Product";
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
        if (catid)
        {
            fetchsubcatbycat();
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
                toast.success("Sub Category found");
            }
            else if (resp.data.statuscode === 0)
            {
                setsubcatdata([]);
                toast.info("No Sub Category found");
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

    useEffect(() =>
    {
        if (catid && subcatid && edit === false)
        {
            fetchprodsby_catid_and_subcatid();
        }
    }, [catid, subcatid])

    async function fetchprodsby_catid_and_subcatid()
    {
        try
        {
            const resp = await axios.get<{ statuscode: number; proddata?: productdetails[] }>(`${import.meta.env.VITE_API_URL}/api/fetchproductbycatidandsubcatid?catid=${catid}&subcatid=${subcatid}`, { withCredentials: true })

            if (resp.data.statuscode === 1 && resp.data.proddata)
            {
                setproductdata(resp.data.proddata)
            }
            else if (resp.data.statuscode === 0)
            {
                setproductdata([]);
                toast.info("No product found");
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

    async function addproduct(e: React.FocusEvent<HTMLFormElement>)
    {
        e.preventDefault()
        try
        {
            if (edit === false) 
            {
                const fdata = new FormData();
                fdata.append("catid", catid)
                fdata.append("subcatid", subcatid)
                fdata.append("pname", pname)
                fdata.append("rate", rate)
                fdata.append("dis", dis)
                fdata.append("stock", stock)
                fdata.append("descp", descp)

                if (picture !== null)
                {
                    fdata.append("picture", picture)
                }

                if (multiplepicture.length !== 0)
                {
                    multiplepicture.forEach(img =>
                    {
                        fdata.append("extraimages", img)
                    })
                }

                const resp = await axios.post<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/addproduct`, fdata, { withCredentials: true })

                if (resp.data.statuscode === 1)
                {
                    toast.success("Product added successfully");
                    fetchprodsby_catid_and_subcatid();
                    canceldb();
                }
                else if (resp.data.statuscode === 0)
                {
                    toast.warn("Product not added ");
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
    }

    function canceldb()
    {
        setedit(false)
        setpname("")
        setrate("")
        setdis("")
        setstock("")
        setdescp("")
        setpicture(null)
        setimgname("")
        setmultiplepicture([])
        setmulimgname([])
        setprodid("")

        // Clear the file input field
        if (fileInputRef.current) 
        {
            fileInputRef.current.value = '';
        }
        if (fileInputRef2.current) 
        {
            fileInputRef2.current.value = '';
        }
    }

    async function ondelete(id: string)
    {
        try
        {
            var pass = window.confirm("Are you sure to Delete")
            if (pass === true)
            {
                const resp = await axios.delete<{ statuscode: number, msg?: string }>(`${import.meta.env.VITE_API_URL}/api/delproduct?id=${id}`, { withCredentials: true })

                if (resp.data.statuscode === 1)
                {
                    toast.success(resp.data.msg)
                    fetchprodsby_catid_and_subcatid();
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
    }

    function onupdate(catitem: productdetails)
    {
        setedit(true)
        setpname(catitem.Name)
        setrate(catitem.Rate)
        setdis(catitem.Discount)
        setstock(catitem.Stock)
        setdescp(catitem.Description)
        setimgname(catitem.Picture)
        setprodid(catitem._id)   // unique product id
        setmulimgname(catitem.ExtraPicture)
    }

    async function updatedb()
    {
        try
        {
            const formdata = new FormData();
            formdata.append("productid", prodid)   // unique id
            formdata.append("catid", catid)  // if u want to change category of product
            formdata.append("subcatid", subcatid)  // if u want to change sub category of product
            formdata.append("upname", pname)  //either old name or new name
            formdata.append("uprate", rate) //either old name or new name
            formdata.append("updis", dis) //either old name or new name
            formdata.append("upstock", stock) //either old name or new name
            formdata.append("updescp", descp) //either old name or new name
            formdata.append("oldpicname", imgname)

            mulimgname.forEach(img =>
            {
                formdata.append("oldextrapicname", img);
            });

            if (picture !== null)
            {
                formdata.append("pic", picture)
            }

            if (multiplepicture.length !== 0)
            {
                multiplepicture.forEach(img =>
                {
                    formdata.append("extraimages", img)
                })
            }

            const resp = await axios.put<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/updateproduct`, formdata, { withCredentials: true })

            if (resp.data.statuscode === 1)
            {
                toast.success("Product Updated Successfully")
                fetchprodsby_catid_and_subcatid();
                canceldb();
            }
            else if (resp.data.statuscode === 0)
            {
                toast.warn("Product not updated");
            }
            else
            {
                toast.warn("some error occured")
            }
        }
        catch (e: any)
        {
            toast.error("Error Occured " + e.message)
        }

    }

    return (
        <div>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Manage Product</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">
                    <h2>Manage Products</h2>

                    <div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">

                        <form name="form1" onSubmit={addproduct} >

                            <select name="subcat" value={catid} className="form-control" onChange={(e) => setcatid(e.target.value)} required>
                                <option value="">Choose Category</option>
                                {
                                    catdata.length > 0 ?
                                        catdata.map((item, index) =>
                                            <option value={item._id} key={index}>{item.catname}</option>
                                        ) : null
                                }
                            </select><br />

                            <select name="subcat" value={subcatid} className="form-control" onChange={(e) => setsubcatid(e.target.value)} required>
                                <option value="">Choose Sub Category</option>
                                {
                                    subcatdata.length > 0 ?
                                        subcatdata.map((item, index) =>
                                            <option value={item._id} key={index}>{item.subcatname}</option>
                                        ) : null
                                }
                            </select><br />

                            <input type="text" name="prodname" value={pname} placeholder="Product Name" required onChange={(e) => setpname(e.target.value)} /><br />

                            <input type="text" name="rate" value={rate} placeholder="Rate" required onChange={(e) => setrate(e.target.value)} /><br />

                            <input type="text" name="dis" value={dis} placeholder="Discount(in percent, do not add % symbol)" required onChange={(e) => setdis(e.target.value)} /><br />

                            <input type="text" name="stock" value={stock} placeholder="Stock" required onChange={(e) => setstock(e.target.value)} /><br />

                            <textarea name="des" placeholder="Description" className="form-control" required value={descp} onChange={(e) => setdescp(e.target.value)}></textarea><br />

                            Primary Image
                            <input type="file" name="ppic" accept="image/*" ref={fileInputRef} onChange={(e) => setpicture(e.target.files ? e.target.files[0] : null)} /><br />

                            {/* {
                                edit === true ?
                                    <>
                                        <img src={`uploads/${imgname}`} height="100" />
                                        Choose new image, if required<br /><br />
                                    </> : null
                            } */}


                            Extra Images (You can choose multiple images)
                            <input type="file" name="mppic" accept="image/*" ref={fileInputRef2} multiple onChange={(e) => setmultiplepicture(e.target.files ? Array.from(e.target.files) : [])} /><br />

                            {
                                edit === false ?
                                    <>
                                        <input type="submit" name="btn1" value="Add" />
                                    </> : null
                            }
                            {
                                edit === true ?
                                    <>
                                        <input type="button" name="btn2" value="Update" onClick={updatedb} />
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
                        productdata.length > 0 ?
                            <>
                                <h2>Added Products</h2><br />
                                <table className="table table-striped timetable_sub ">
                                    <tbody >
                                        <tr >
                                            <th>Pic</th>
                                            <th>Category</th>
                                            <th>Sub Category</th>
                                            <th>Name</th>
                                            <th>Rate</th>
                                            <th>Discount</th>
                                            <th>Stock</th>
                                            <th>Description</th>
                                            <th>Update</th>
                                            <th>Delete</th>
                                        </tr>
                                    </tbody>
                                    {
                                        productdata.map((item, index) =>
                                            <tr key={index} >
                                                <td><img src={`${import.meta.env.VITE_API_URL}/uploads/${item.Picture}`} height="75" /></td>
                                                <td >{item.catid.catname}</td>
                                                <td >{item.subcatid.subcatname}</td>
                                                <td >{item.Name}</td>
                                                <td >{item.Rate}</td>
                                                <td >{item.Discount}</td>
                                                <td >{item.Stock}</td>
                                                <td >{item.Description}</td>
                                                <td><button className="btn btn-primary" onClick={() => onupdate(item)} >Update</button></td>
                                                <td><button className="btn btn-danger" onClick={() => ondelete(item._id)}>Delete</button></td>
                                            </tr>
                                        )
                                    }
                                </table><br /><br />
                                {productdata.length} Products found
                            </> : null
                    }
                </div>
            </div>
            <br /><br /><Footer />
        </div>
    )
}

export default ManageProduct
