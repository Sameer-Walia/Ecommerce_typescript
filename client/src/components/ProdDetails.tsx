import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { Rootstate } from "../store";
import Footer from "./Footer";

interface product
{
    Picture: string;
    Name: string;
    Description: string;
    Rate: number;
    Stock: number;
    Discount: number;
    ExtraPicture: string[]
}

function ProdDetails() 
{
    const { email } = useSelector((state: Rootstate) => state.auth)

    const [prod, setprod] = useState<product | null>(null);

    const [stock, setstock] = useState<number[]>([])
    const [qty, setqty] = useState<number>(0)
    const [tc, settc] = useState<number>(0)
    const [extraimg, setextraimg] = useState<string[]>([])

    const [remcost, setremcost] = useState<number>(0)

    const navigate = useNavigate()
    const [params] = useSearchParams();
    const prdid = params.get("pid")

    useEffect(() =>
    {
        fetchproductbyid();
    }, [prdid])

    useEffect(() =>
    {
        if (prod)
        {
            setremcost(prod.Rate - (prod.Discount * prod.Rate) / 100)
            var stock2 = [];
            if (prod.Stock > 10)
            {
                for (var x = 1; x <= 10; x++)
                {
                    stock2.push(x);//1-10
                }
            }
            else
            {
                for (var x = 1; x <= prod.Stock; x++)
                {
                    stock2.push(x);//1-5
                }
            }
            setstock(stock2);
        }

    }, [prod])

    useEffect(() =>
    {
        settc(remcost * qty)
    }, [qty])

    const rtc = Math.round(tc);

    async function fetchproductbyid() 
    {
        try 
        {
            const resp = await axios.get<{ statuscode: number, product?: product }>(`${import.meta.env.VITE_API_URL}/api/fetchproductbyid?id=${prdid}`)

            if (resp.data.statuscode === 1 && resp.data.product) 
            {
                setprod(resp.data.product)
                setextraimg(resp.data.product.ExtraPicture)
            }
            else if (resp.data.statuscode === 0) 
            {
                setprod(null)
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

    async function addtocart(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault()
        if (sessionStorage.getItem("userdata") === null)
        {
            toast.info("Please login to add to cart");
            navigate("/login");
            return
        }
        if (!prod) return;
        else
        {
            const cartdata = { pid: prdid, picture: prod.Picture, pname: prod.Name, rate: remcost, qty: qty, tc: rtc, email: email }
            try
            {
                const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/addtocart`, cartdata)

                if (resp.data.statuscode === 1)
                {
                    navigate("/showcart");
                }
                else if (resp.data.statuscode === 0)
                {
                    toast.warning("Problem while adding to cart, try again")
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
    }

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/homepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Product Details</li>
                    </ol>
                </div>
            </div>



            <div className="products">
                <div className="container">
                    {
                        prod && (
                            <div className="agileinfo_single">
                                <div className="col-md-4 agileinfo_single_left">
                                    <img id="example" src={`${import.meta.env.VITE_API_URL}/uploads/${prod.Picture}`} alt=" " className="img-responsive" />
                                </div>
                                <div className="col-md-8 agileinfo_single_right">
                                    <h2>{prod.Name}</h2>
                                    <div className="w3agile_description">
                                        <h4>Description :</h4>
                                        <p>{prod.Description}</p>
                                    </div>
                                    <div className="snipcart-item block">
                                        <div className="snipcart-thumb agileinfo_single_right_snipcart">
                                            <h4 className="m-sing">₹{remcost}<span>₹{prod.Rate}</span></h4>
                                        </div>
                                        {
                                            prod.Stock > 0 ?
                                                <div className="snipcart-details agileinfo_single_right_details">
                                                    <form name="form1" onSubmit={addtocart} >
                                                        <fieldset>
                                                            <select name="qty" className="form-control" onChange={(e) => setqty(Number(e.target.value))} required>
                                                                <option value="" >Choose Quantity</option>
                                                                {
                                                                    stock.map((item, index) =>
                                                                        <option key={index} >{item}</option>
                                                                    )
                                                                }
                                                            </select><br />
                                                            <input type="submit" name="submit" value="Add to cart" className="button" />
                                                        </fieldset>
                                                    </form>
                                                </div> : <b>Out Of Stock</b>
                                        }
                                        {
                                            extraimg.length > 0 ?
                                                <>
                                                    <h2>Product Images</h2>
                                                    {
                                                        extraimg.map((item, index) =>
                                                            <img src={`${import.meta.env.VITE_API_URL}/uploads/${item}`} key={index} />
                                                        )
                                                    }
                                                </> : null
                                        }
                                    </div>
                                </div>
                                <div className="clearfix"> </div>
                            </div>
                        )}
                </div>
            </div>
            <br /><br /><Footer />
        </>
    )
}
export default ProdDetails;