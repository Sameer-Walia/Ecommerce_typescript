import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, Rootstate } from "../store";
import { LogOut } from "../ReduxSlice/authslice";
import axios from "axios";

function AdminHeader()
{
    const [sterm, setsterm] = useState<string>('');

    const { isLoggedIn, name, email } = useSelector((state: Rootstate) => state.auth)
    const dispatch = useDispatch<AppDispatch>()

    const navi = useNavigate();

    async function logout() 
    {
        dispatch(LogOut())
        sessionStorage.clear()
        await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, { withCredentials: true })
        navi("/login")
        toast.info("You have successfully Logged Out")
    }

    function onsearch(e: React.MouseEvent<HTMLButtonElement>)
    {
        e.preventDefault();
        navi(`/searchresults?s=${sterm}`);
    }

    return (
        <>
            <div className="agileits_header ">
                <div className="container">
                    <div className="w3l_offers">
                        {
                            isLoggedIn === false ?
                                <>
                                    <p>Welcome {name}</p>
                                </> : <p>Welcome {name}<br />
                                    Your Email is  {email}</p>
                        }
                    </div>
                    <div className="agile-login">
                        {
                            isLoggedIn === false ?
                                <ul>
                                    <li><Link to="/signup">Create Account</Link></li>
                                    <li><Link to="/nothanks">Resend Email</Link></li>
                                    <li><Link to="/login" >Login</Link></li>
                                </ul>
                                :
                                <ul>
                                    <li><Link to="/userorderhistory">Your Orders </Link> </li>
                                    <li><Link to="/changepassword">Change Password</Link></li>
                                    <li><button className="btn btn-primary" onClick={logout}>Log-Out</button></li>
                                </ul>
                        }
                    </div>
                    <div className="product_list_header">
                        {
                            isLoggedIn === true ?
                                <>
                                    <form className="last">
                                        <Link to="/showcart"><button className="w3view-cart" type="submit" name="submit" value=""><i className="fa fa-cart-arrow-down" aria-hidden="true"></i></button></Link>
                                    </form>
                                </> : null
                        }
                    </div>
                    <div className="clearfix"> </div>
                </div>
            </div>

            <div className="logo_products">
                <div className="container">
                    <div className="w3ls_logo_products_left1">
                        <ul className="phone_email">
                            <li><i className="fa fa-phone" aria-hidden="true"></i>Order online or call us : (+0123) 234 567</li>

                        </ul>
                    </div>
                    <div className="w3ls_logo_products_left">
                        <h1><Link to="/home">Super Market</Link></h1>
                    </div>
                    <div className="w3l_search">
                        {/* <form action="#" method="post"> */}
                        <input type="search" name="Search" placeholder="Search for a Product..." required onChange={(e) => setsterm(e.target.value)} />
                        <button type="submit" className="btn btn-default search" aria-label="Left Align" onClick={onsearch}>
                            <i className="fa fa-search" aria-hidden="true"> </i>
                        </button>
                        <div className="clearfix"></div>
                        {/* </form> */}
                    </div>

                    <div className="clearfix"> </div>
                </div>
            </div>

            <div className="navigation-agileits">
                <div className="container">
                    <nav className="navbar navbar-default">
                        <div className="navbar-header nav_2">
                            <button type="button" className="navbar-toggle collapsed navbar-toggle1" data-toggle="collapse" data-target="#bs-megadropdown-tabs">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-megadropdown-tabs">
                            <ul className="nav navbar-nav">
                                <li className="active"><Link to="/adminhome">Home</Link></li>
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">Users<b className="caret"></b></a>
                                    <ul className="dropdown-menu multi-column columns-3">
                                        <div className="row">
                                            <div className="multi-gd-img">
                                                <ul className="multi-column-dropdown">
                                                    <h6>User-Data</h6>
                                                    <li><Link to="/userslist">Userslist</Link></li>
                                                    <li><Link to="/Searchuser">Search User</Link></li>
                                                </ul>
                                            </div>

                                        </div>
                                    </ul>
                                </li>
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">Manage<b className="caret"></b></a>
                                    <ul className="dropdown-menu multi-column columns-3">
                                        <div className="row">
                                            <div className="multi-gd-img">
                                                <ul className="multi-column-dropdown">
                                                    <h6>All Management</h6>
                                                    <li><Link to="/managecategory">Manage Category</Link></li>
                                                    <li><Link to="/managesubcategory">Manage Sub-Category</Link></li>
                                                    <li><Link to="/manageproduct">Manage Product</Link></li>
                                                </ul>
                                            </div>


                                        </div>
                                    </ul>
                                </li>
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">Orders<b className="caret"></b></a>
                                    <ul className="dropdown-menu multi-column columns-3">
                                        <div className="row">
                                            <div className="multi-gd-img">
                                                <ul className="multi-column-dropdown">
                                                    <h6>All Orders</h6>
                                                    <li><Link to="/vieworder">View Orders</Link></li>
                                                    <li><Link to="/searchoderid">Search Order</Link></li>
                                                </ul>
                                            </div>

                                        </div>
                                    </ul>
                                </li>
                                <li className="active"><Link to="/admincontactus">Contact-us</Link></li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    )
}
export default AdminHeader;