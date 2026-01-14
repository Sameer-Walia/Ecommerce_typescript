import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Footer from './Footer';

function NoThanks()
{

    const [email, setemail] = useState<string>("");
    const [showForm, setShowForm] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    async function resendMail(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault()
        try 
        {
            setLoading(true);
            const data = { email }
            const resp = await axios.post<{ statuscode: number; msg?: string }>(`${import.meta.env.VITE_API_URL}/api/resendmail`, data);

            if (resp.data.statuscode === 1)
            {
                toast.success("Activation mail resent successfully! , please check your mail");
                setemail("")
            }
            else if (resp.data.statuscode === 2)
            {
                toast.warn("Activation mail not resent successfully!  , error while resending activation mail");
            }
            else if (resp.data.statuscode === 0)
            {
                toast.warn(resp.data.msg)
            }
            else
            {
                toast.error("Some Problem Occured")
            }
        }
        catch (e: any) 
        {
            toast.error("Error Occured " + e.message)
        }
        finally 
        {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">No Thanks Page</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">

                    {
                        showForm ? <h2>Resend Activation Mail Form</h2> :
                            <button onClick={() => setShowForm(true)} className="btn btn-primary">
                                Resend Activation Mail
                            </button>
                    }

                    {
                        showForm ?
                            <div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">
                                <form name="form1" onSubmit={resendMail}>
                                    <div style={{ marginTop: "20px" }}>

                                        <input type="email" placeholder="Enter your registered email" value={email} onChange={(e) => setemail(e.target.value)} required /><br />

                                        {
                                            loading ?
                                                <div className="loader-container">
                                                    <img src="images/loader.gif" alt="loader" className="loader" />
                                                </div> : <input type="submit" name="btn" value="Resend Mail" className="btn btn-success" />
                                        }
                                    </div>
                                </form>
                            </div> : null
                    }<br /><br />

                    <p><strong>Thank you!</strong></p><br />

                </div>
            </div>
            <Footer />
        </div>
    )
}

export default NoThanks

