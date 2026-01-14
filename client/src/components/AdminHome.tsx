import { useSelector } from "react-redux";
import type { Rootstate } from "../store";
import Footer from "./Footer";

function AdminHome()
{

    const { name } = useSelector((state: Rootstate) => state.auth)

    return (
        <>
            <div className="register">
                <div className="container">
                    <h2>Welcome {name}</h2>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default AdminHome;