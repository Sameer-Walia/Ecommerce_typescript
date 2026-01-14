import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

interface data
{
    _id: string;
    Name: string;
    Picture: string;
}

function SearchProducts()
{
    const [params] = useSearchParams();
    const sterm = params.get("s");

    const [prodsdata, setprodsdata] = useState<data[]>([]);

    useEffect(() =>
    {
        if (sterm)
        {
            searchprods();
        }
    }, [sterm])

    async function searchprods()
    {
        try
        {
            const resp = await axios.get<{ statuscode: number; proddata?: data[] }>(`${import.meta.env.VITE_API_URL}/api/searchproducts?q=${sterm}`)

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
    return (
        <>
            <div className="login">
                <div className="container">
                    {
                        prodsdata.length > 0 ?
                            <>
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
                                                                        <img title=" " alt=" " src={`${import.meta.env.VITE_API_URL}/uploads/${item.Picture}`} height='125' />
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
                            </> : <h2>No products found</h2>
                    }


                </div>
            </div>
        </>
    )
}
export default SearchProducts;