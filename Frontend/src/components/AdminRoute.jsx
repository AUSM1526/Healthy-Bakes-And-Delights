import React from 'react';
import {useSelector} from 'react-redux';
import {Navigate, Outlet} from 'react-router-dom';

function AdminRoute(){
    const user = useSelector((state) => state.auth.user);

    return(
        user.accountType=="admin" ? <Outlet/> : <Navigate to = "/"/>
    )
}

export default AdminRoute;