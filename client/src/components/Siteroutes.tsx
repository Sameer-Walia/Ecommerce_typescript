import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Home from "./Home"
import Signup from "./Signup"
import NoThanks from "./NoThanks"
import Thanks from "./Thanks"
import ActivateAccount from "./ActivateAccount"
import Login from "./Login"
import AdminHome from "./AdminHome"
import UsersList from "./UsersList"
import SearchUser from "./SearchUser"
import ManageCategory from "./ManageCategory"
import ManageSubCategory from "./ManageSubCategory"
import ManageProduct from "./ManageProduct"
import ProdDetails from "./ProdDetails"
import ShowCart from "./ShowCart"
import OrderSummary from "./OrderSummary"
import CheckOut from "./CheckOut"
import ViewOrders from "./ViewOrders"
import UpdateStatus from "./UpdateStatus"
import SearchOrderId from "./SearchOrderId"
import UserOrderHistory from "./UserOrderHistory"
import OrderItems from "./OrderItems"
import SearchProducts from "./SearchProducts"
import ContactUs from "./ContactUs"
import AdminContactUs from "./AdminContactUs"
import ForgotPassword from "./ForgotPassword"
import ResetPassword from "./ResetPassword"
import ChangePassword from "./ChangePassword"
import AdminRouteProtector from "./AdminRouteProtector"
import UserRouteProtector from "./UserRouteProtector"
import { useEffect } from "react"
import Cookies from "universal-cookie"
import Categories from "./Categories"
import SubCategories from "./SubCategories"
import Product from "./Product"

function Siteroutes()
{
    const usercookie = new Cookies()
    const navi = useNavigate()
    const location = useLocation()

    useEffect(() =>
    {
        const cookieUser = usercookie.get("staysignin");
        if (cookieUser)
        {
            try
            {
                const publicPaths = ["/"];

                if (publicPaths.includes(location.pathname))
                {
                    if (cookieUser.usertype === "admin")
                    {
                        navi("/adminhome");
                    }
                    else
                    {
                        navi("/");
                    }
                }
            }
            catch (err)
            {
                console.error("Error parsing cookie user:", err);
            }
        }
    }, [location.pathname])

    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/home" element={<Home />}></Route>
                <Route path="/adminhome" element={<AdminRouteProtector compname={AdminHome} />}></Route>
                <Route path="/signup" element={<Signup />}></Route>
                <Route path="/nothanks" element={<NoThanks />}></Route>
                <Route path="/thanks" element={<Thanks />}></Route>
                <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
                <Route path="/category" element={<Categories />}></Route>
                <Route path="/subcategory" element={<SubCategories />}></Route>
                <Route path="/products" element={<Product />}></Route>
                <Route path="/resetpassword" element={<ResetPassword />}></Route>
                <Route path="/changepassword" element={<UserRouteProtector compname={ChangePassword} />}></Route>
                <Route path="/activateaccount" element={<ActivateAccount />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/userslist" element={<AdminRouteProtector compname={UsersList} />}></Route>
                <Route path="/Searchuser" element={<AdminRouteProtector compname={SearchUser} />}></Route>
                <Route path="/managecategory" element={<AdminRouteProtector compname={ManageCategory} />}></Route>
                <Route path="/managesubcategory" element={<AdminRouteProtector compname={ManageSubCategory} />}></Route>
                <Route path="/manageproduct" element={<AdminRouteProtector compname={ManageProduct} />}></Route>
                <Route path="/details" element={<ProdDetails />}></Route>
                <Route path="/showcart" element={<UserRouteProtector compname={ShowCart} />}></Route>
                <Route path="/checkout" element={<UserRouteProtector compname={CheckOut} />}></Route>
                <Route path="/ordersummary" element={<UserRouteProtector compname={OrderSummary} />}></Route>
                <Route path="/vieworder" element={<AdminRouteProtector compname={ViewOrders} />}></Route>
                <Route path="/updatestatus" element={<AdminRouteProtector compname={UpdateStatus} />}></Route>
                <Route path="/searchoderid" element={<AdminRouteProtector compname={SearchOrderId} />}></Route>
                <Route path="/userorderhistory" element={<UserOrderHistory />}></Route>
                <Route path="/vieworderitems" element={<UserRouteProtector compname={OrderItems} />}></Route>
                <Route path="/searchresults" element={<SearchProducts />}></Route>
                <Route path="/contactus" element={<UserRouteProtector compname={ContactUs} />}></Route>
                <Route path="/admincontactus" element={<AdminRouteProtector compname={AdminContactUs} />}></Route>

            </Routes>
        </div>
    )
}

export default Siteroutes
