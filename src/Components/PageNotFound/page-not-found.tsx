import * as React from 'react'
import './page-not-found.css'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { ComponentBase } from 'resub'
// import logo from '../../assets/signify-logo.png';

export default class PageNotFound extends ComponentBase<any, any> {

    public render() {
        return (
            <Card className='margin-20'>
                <CardContent>
                    <div className='center-align'>
                        {/* <img className="logo-img" src={logo} alt='Logo' /> */}
                    </div>
                    <div className='center-align padding-top-40'>
                        <h2 className='font-size-38'>404 - PAGE NOT FOUND</h2>
                    </div>
                    <span className='center-align font-size-18'>
                        The page you are looking for might have been removed, had its name change or is temporarily unavailable!
                    </span>
                    <div className='center-align padding-top-20'>
                        <Button className='btn-style usermanagement-button' onClick={this.navigateToDashboard}>Go to Login</Button>
                    </div>
                </CardContent >
            </Card >
        )
    }

    private navigateToDashboard = () => {
        this.props.history.push('/login')
    }
}