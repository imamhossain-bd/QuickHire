import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Root from '../pages/Layout/Root';
import Home from '../pages/Home/Home';
import Companies from '../components/Companies';
import Category from '../components/Category';
import Posting from '../components/Posting';
import FeaturedJobs from '../components/FeaturedJobs';
import LatestJobs from '../components/LatestJobs';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/SignUp';
import Dashboard from '../dashboard/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import JobList from '../components/Joblist';
import JobDetails from '../components/Jobdetails';
import ApplyJob from '../components/Applyjob';
import AdminRoute from '../admin/Adminroute';
import AdminPanel from '../admin/AdminPanel';
import AdminJobApplications from '../admin/AdminJobApplications';

const Router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/companies',
                element: <Companies />
            },
            {
                path: '/category',
                element: <Category />
            },
            {
                path: '/posting',
                element: <Posting />
            },
            {
                path: '/featured-jobs',
                element: <FeaturedJobs />
            },
            {
                path: '/latest-jobs',
                element: <LatestJobs />
            },
            {
                path: '/jobs',
                element: <JobList />
            },
            {
                path: '/jobs/:id',
                element: <JobDetails />
            },
            {
                path: '/jobs/:id/apply',
                element: <ApplyJob />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
        ]
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin',
        element: (
            <AdminRoute>
                <AdminPanel />
            </AdminRoute>
        ),
    },
    {
        path: '/admin/jobs/:id',
        element: (
            <AdminRoute>
                <AdminJobApplications />
            </AdminRoute>
        ),
    },
]);

export default Router;