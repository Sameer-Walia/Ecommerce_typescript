import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./Footer";

interface SubCategoryData
{
    _id: string;
    subcatpic: string;
    subcatname: string;
    catid: data;
}
interface data
{
    catname: string
}

function SubCategories()
{
    const [subcatdata, setsubcatdata] = useState<SubCategoryData[]>([])
    const [params] = useSearchParams();
    const catid = params.get("cat_id")

    useEffect(() => 
    {
        if (catid !== "")
        {
            fetchsubcatbycatid();
        }
    }, [catid])

    async function fetchsubcatbycatid() 
    {
        try 
        {
            const resp = await axios.get<{ statuscode: number; subcatalldata?: SubCategoryData[] }>(`${import.meta.env.VITE_API_URL}/api/fetchsubcatbycatid?cid=${catid}`)

            if (resp.data.statuscode === 1 && resp.data.subcatalldata) 
            {
                setsubcatdata(resp.data.subcatalldata)
            }
            else if (resp.data.statuscode === 0) 
            {
                setsubcatdata([]);
            }
            else 
            {
                toast.warn("Some error occured")
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
                        <li className="active">Sub Categories</li>
                    </ol>
                </div>
            </div>
            <div className="login">
                <div className="container">
                    {
                        subcatdata.length > 0 ?
                            <>
                                <h2>{subcatdata[0].catid.catname} :- Sub-Categories</h2><br />
                                {
                                    subcatdata.map((item, index) =>
                                        <div className="col-md-4 top_brand_left" key={index}>
                                            <div className="hover14 column">
                                                <div className="agile_top_brand_left_grid">
                                                    <div className="agile_top_brand_left_grid1">
                                                        <figure>
                                                            <div className="snipcart-item block" >
                                                                <div className="snipcart-thumb">
                                                                    <Link to={`/products?subcat_id=${item._id}`}>
                                                                        <img src={`${import.meta.env.VITE_API_URL}/uploads/${item.subcatpic}`} height="125" title=" " alt=" "></img>
                                                                        <p>{item.subcatname}</p>
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
                            </> : <h2>No Sub Category is added by Admin</h2>
                    }

                </div>
            </div><br /><br />
            <Footer />
        </>
    )
}
export default SubCategories;