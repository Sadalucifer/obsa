import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { render } from 'react-dom'

export interface ProtectedRouteProps {
    path: any,
    isLoggedIn: any,
    component?: any,
    render?: any
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isLoggedIn, component: Component, render, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props: any) => {
                const location: any = props.location
                if (!isLoggedIn) {
                    return <Redirect
                        to={'/login'}

                    />
                }
                return Component ? <Component {...props} /> : render(props)
            }}
        />
    )
}

export default ProtectedRoute
