import { ToastContainer } from "react-toastify"
import Header from "./components/Header"
import Siteroutes from "./components/Siteroutes"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, Rootstate } from "./store"
import { login } from "./ReduxSlice/authslice"
import AdminHeader from "./components/AdminHeader"
import Cookies from "universal-cookie"

function App()
{
  const usercokkie = new Cookies()
  const dispatch = useDispatch<AppDispatch>()
  const { isLoggedIn, usertype } = useSelector((state: Rootstate) => state.auth)

  useEffect(() =>
  {
    const data = sessionStorage.getItem("userdata");
    if (data)
    {
      dispatch(login(JSON.parse(data)));
    }
  }, []);

  useEffect(() =>
  {
    const cookieUser = usercokkie.get("staysignin");
    if (cookieUser)
    {
      dispatch(login(cookieUser))
      sessionStorage.setItem("userdata", JSON.stringify(cookieUser));
    }
  }, []);

  return (
    <>
      {isLoggedIn === false ? <Header /> :
        usertype === "admin" ? <AdminHeader /> : <Header />}
      <Siteroutes />
      <ToastContainer theme="colored" />
    </>
  )
}

export default App
