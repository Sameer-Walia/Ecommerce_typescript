import { Link } from 'react-router-dom'

function Thanks()
{

    return (
        <div>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Thanks Page</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">
                    <h2>Thanks for signing up. You will get an email on your registered address. Click on the link in the mail to activate your Account.</h2>
                    <h2>Its a one-time activation only. After that you can login directly</h2>

                    <p><strong>Thank you!</strong></p><br />

                </div>
            </div>
        </div>
    )
}

export default Thanks

