import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./Footer";

interface Category
{
    _id: string;
    catpic: string;
    catname: string;
}

function Categories()
{
    const [catdata, setcatdata] = useState<Category[]>([])

    async function getallcat() 
    {
        try 
        {
            const resp = await axios.get<{ statuscode: number; categorydata?: Category[] }>(`${import.meta.env.VITE_API_URL}/api/getallcat`)

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
                toast.warn("some problem occured")
            }
        }
        catch (e: any) 
        {
            toast.error("Error Occured " + e.message)
        }
    }

    useEffect(() =>
    {
        getallcat();
    }, [])

    useEffect(() =>
    {
        document.title = "Products"
    }, [])

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/homepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Categories</li>
                    </ol>
                </div>
            </div>
            <div className="login">
                <div className="container">
                    {
                        catdata.length > 0 ?
                            <>
                                <h2>Product Categories</h2><br />
                                {
                                    catdata.map((item, index) =>
                                        <div className="col-md-4 top_brand_left" key={index}>
                                            <div className="hover14 column">
                                                <div className="agile_top_brand_left_grid">
                                                    <div className="agile_top_brand_left_grid1">
                                                        <figure>
                                                            <div className="snipcart-item block" >
                                                                <div className="snipcart-thumb">
                                                                    <Link to={`/subcategory?cat_id=${item._id}`}>
                                                                        <img src={`${import.meta.env.VITE_API_URL}/uploads/${item.catpic}`} height="125" title=" " alt=" "></img>
                                                                        <p>{item.catname}</p>
                                                                    </Link>
                                                                </div>
                                                                <div className="snipcart-details top_brand_home_details ">
                                                                </div>
                                                            </div>
                                                        </figure>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </> : <h2>No product is added by Admin</h2>
                    }

                </div>
            </div>
            <Footer />
        </>
    )
}
export default Categories;