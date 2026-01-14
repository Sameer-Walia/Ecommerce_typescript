import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import Footer from "./Footer";


function ContactUs()
{

    const [uname, setuname] = useState<string>("");
    const [phone, setphone] = useState<string>("");
    const [email, setemail] = useState<string>("");
    const [message, setmessage] = useState<string>("");
    const [loading, setloading] = useState<boolean>(false);
    const navi = useNavigate();
    const [hcaptcha, sethcaptcha] = useState<boolean>(false);


    function onChange(value: string | null) 
    {
        console.log("Captcha value:", value);
        // if (!value)
        if (value === null || value === "")
        {
            sethcaptcha(false)
        }
        else
        {
            sethcaptcha(true)
        }
    }

    async function onsend(e: React.FormEvent<HTMLFormElement>) 
    {
        e.preventDefault()

        if (hcaptcha === true)
        {
            const data = { uname, phone, email, message }
            try 
            {
                setloading(true);
                const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/ContactUs`, data)
                if (resp.data.statuscode === 0) 
                {
                    toast.warning("Error sending message , try again");
                }
                else if (resp.data.statuscode === 1) 
                {
                    toast.success("Message submitted successfully. We will revert back in 24 hours")
                    setuname("")
                    setphone("")
                    setemail("")
                    setmessage("")
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
                setloading(false)
            }
        }
        else
        {
            toast.error("Captcha Verification failed , try again")
        }
    }

    useEffect(() =>
    {
        const data = sessionStorage.getItem("userdata")
        if (!data) 
        {
            navi("/login")
            toast.error("please login to access the page")
        }
    }, [])

    useEffect(() =>
    {
        document.title = "Contact Us";
    }, []);



    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Contact-Us</li>
                    </ol>
                </div>
            </div>

            <div className="about">
                <div className="w3_agileits_contact_grids">
                    <div className="col-md-6 w3_agileits_contact_grid_left">
                        <div className="agile_map">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.3905851087434!2d-34.90500565012194!3d-8.061582082752993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab18d90992e4ab%3A0x8e83c4afabe39a3a!2sSport+Club+Do+Recife!5e0!3m2!1sen!2sin!4v1478684415917" style={{ border: 0 }}></iframe>
                        </div>
                        <div className="agileits_w3layouts_map_pos">
                            <div className="agileits_w3layouts_map_pos1">
                                <h3>Contact Info</h3>
                                <p>1234k Avenue, 4th block, New York City.</p>
                                <ul className="wthree_contact_info_address">
                                    <li><i className="fa fa-envelope" aria-hidden="true"></i><a href="mailto:info@example.com">info@example.com</a></li>
                                    <li><i className="fa fa-phone" aria-hidden="true"></i>+(0123) 232 232</li>
                                </ul>
                                <div className="w3_agile_social_icons w3_agile_social_icons_contact">
                                    <ul>
                                        <li><a href="#" className="icon icon-cube agile_facebook"></a></li>
                                        <li><a href="#" className="icon icon-cube agile_rss"></a></li>
                                        <li><a href="#" className="icon icon-cube agile_t"></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 w3_agileits_contact_grid_right">
                        <h2 className="w3_agile_header">Leave a<span> Message</span></h2>

                        <form name="contactform" onSubmit={onsend} >
                            <span className="input input--ichiro">
                                <input className="input__field input__field--ichiro" type="text" id="input-25" name="Name" placeholder=" " required onChange={(e) => setuname(e.target.value)} value={uname} />
                                <label className="input__label input__label--ichiro" htmlFor="input-25">
                                    <span className="input__label-content input__label-content--ichiro">Your Name</span>
                                </label>
                            </span>
                            <span className="input input--ichiro">
                                <input className="input__field input__field--ichiro" type="tel" id="input-27" name="Number" placeholder=" " required onChange={(e) => setphone(e.target.value)} value={phone} maxLength={10} minLength={10} />
                                <label className="input__label input__label--ichiro" htmlFor="input-27">
                                    <span className="input__label-content input__label-content--ichiro">Your Phone Number</span>
                                </label>
                            </span>
                            <span className="input input--ichiro">
                                <input className="input__field input__field--ichiro" type="email" id="input-26" name="Email" placeholder=" " required onChange={(e) => setemail(e.target.value)} value={email} />
                                <label className="input__label input__label--ichiro" htmlFor="input-26">
                                    <span className="input__label-content input__label-content--ichiro">Your Email</span>
                                </label>
                            </span>
                            <textarea name="Message" value={message} placeholder="Your message here..." required onChange={(e) => setmessage(e.target.value)}></textarea>

                            <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={onChange} />

                            {
                                loading ?
                                    <div className="loader-container">
                                        <img src="images/loader.gif" alt="loader" className="loader" />
                                    </div> : <input type="submit" value="Submit" />
                            }
                        </form>
                    </div>
                    <div className="clearfix"> </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default ContactUs;