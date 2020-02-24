import React from 'react'
import { Route, Redirect } from 'react-router-dom'

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
                if (!isLoggedIn) {
                    return <Redirect
                        to={{
                            pathname: '/login'
                            // calledRoute: { from: props.location }
                        }}
                    />
                }
                return Component ? <Component {...props} /> : render(props)
            }}
        />
    )
}

export default ProtectedRoute
