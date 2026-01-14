import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import { toast } from 'react-toastify';
import Footer from './Footer';


const spanStyle = {
    padding: '20px',
    color: 'white'
}

const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    height: '400px'
}
const slideImages = [
    {
        url: 'images/11.jpg',
        caption1: <h3>First slide label</h3>,
        caption2: <h1>Some representative content.</h1>,
        caption3: <p>Get the most of reduction in your team’s operating creates amazing UI/UX experiences.</p>,
    },
    {
        url: 'images/22.jpg',
        caption1: <h3>Second slide label</h3>,
        caption2: <h1>Some representative content.</h1>,
        caption3: <p>Get the most of reduction in your team’s operating creates amazing UI/UX experiences.</p>,
    },
    {
        url: 'images/44.jpg',
        caption1: <h3>Third slide label</h3>,
        caption2: <h1>Some representative content.</h1>,
        caption3: <p>Get the most of reduction in your team’s operating creates amazing UI/UX experiences.</p>,
    },
];

interface Product
{
    Name: string;
    Picture: string;
    _id: string;
}


function Home()
{

    const [productdata, setproductdata] = useState<Product[]>([]);

    async function fetchlatestproducts()
    {
        try
        {
            const resp = await axios.get<{ statuscode: number; proddata?: Product[] }>(`${import.meta.env.VITE_API_URL}/api/fetchlatestprods`)

            if (resp.data.statuscode === 1 && resp.data.proddata)
            {
                setproductdata(resp.data.proddata)
            }
            else if (resp.data.statuscode === 0)
            {
                setproductdata([]);
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
        document.title = "HomePage";
    }, []);

    useEffect(() =>
    {
        fetchlatestproducts();
    }, [])

    return (
        <>
            <div className="slide-container">
                <Slide>
                    {
                        slideImages.map((item, index) =>
                            <div key={index}>
                                <div style={{ ...divStyle, 'backgroundImage': `url(${item.url})`, flexDirection: 'column' }}>
                                    <div style={spanStyle}>{item.caption1}</div>
                                    <div style={spanStyle}>{item.caption2}</div>
                                    <div style={spanStyle}>{item.caption3}</div>

                                </div>
                            </div>
                        )
                    }
                </Slide>
            </div>
            <div className="register">
                <div className="container">
                    <h2>Welcome to SuperMarket</h2>
                    {
                        productdata.length > 0 ?
                            <>
                                {
                                    productdata.map((item, index) =>
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
            </div>
            <Footer />
        </>
    )
}
export default Home;