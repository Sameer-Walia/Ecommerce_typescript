import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./Footer";

interface ProductDetails
{
    _id: string
    Picture: string
    Name: string
    subcatid: Data
}

interface Data
{
    subcatname: string
}

function Product()
{
    const [params] = useSearchParams();
    const subcatid = params.get("subcat_id")

    const [prodsdata, setprodsdata] = useState<ProductDetails[]>([])

    useEffect(() => 
    {
        if (subcatid)
        {
            fetchprodbysubcatid();
        }
    }, [subcatid])

    async function fetchprodbysubcatid() 
    {
        try 
        {
            const resp = await axios.get<{ statuscode: number; proddata?: ProductDetails[] }>(`${import.meta.env.VITE_API_URL}/api/fetchprodbysubcatid?subid=${subcatid}`)

            if (resp.data.statuscode === 1 && resp.data.proddata) 
            {
                setprodsdata(resp.data.proddata)
            }
            else if (resp.data.statuscode === 0) 
            {
                setprodsdata([]);
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
                        <li className="active">Products</li>
                    </ol>
                </div>
            </div>
            <div className="login">
                <div className="container">
                    {
                        prodsdata.length > 0 ?
                            <>
                                <h2>{prodsdata[0].subcatid.subcatname} :- Products</h2><br />
                                {
                                    prodsdata.map((item, index) =>
                                        <div className="col-md-4 top_brand_left" key={index}>
                                            <div className="hover14 column">
                                                <div className="agile_top_brand_left_grid">
                                                    <div className="agile_top_brand_left_grid1">
                                                        <figure>
                                                            <div className="snipcart-item block" >
                                                                <div className="snipcart-thumb">
                                                                    <Link to={`/details?pid=${item._id}`}>
                                                                        <img src={`${import.meta.env.VITE_API_URL}/uploads/${item.Picture}`} height="125"></img>
                                                                        <p>{item.Name}</p>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </figure>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </> : <h2>No product is Added By Admin</h2>
                    }
                </div>
            </div><br /><br />
            <Footer />
        </>
    )
}
export default Product;