import { lazy } from 'react'
import AuthGuard from './components/auth/AuthGuard'
import AdminGuard from './components/auth/AdminGuard'

const Home = lazy(() => import('./pages/public/Home'))
const About = lazy(() => import('./pages/public/About'))
const Contact = lazy(() => import('./pages/public/Contact'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const UserDashboard = lazy(() => import('./pages/user/Dashboard'))
const Upload = lazy(() => import('./pages/user/Upload'))
const Verify = lazy(() => import('./pages/user/Verify'))
const History = lazy(() => import('./pages/user/History'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AllUploads = lazy(() => import('./pages/admin/AllUploads'))
const BlockchainExplorer = lazy(() => import('./pages/admin/BlockchainExplorer'))
const NotFound = lazy(() => import('./pages/error/NotFound'))
const Unauthorized = lazy(() => import('./pages/error/Unauthorized'))

const routes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { 
    path: '/dashboard', 
    element: <AuthGuard><UserDashboard /></AuthGuard> 
  },
  { 
    path: '/upload', 
    element: <AuthGuard><Upload /></AuthGuard> 
  },
  { 
    path: '/verify', 
    element: <AuthGuard><Verify /></AuthGuard> 
  },
  { 
    path: '/history', 
    element: <AuthGuard><History /></AuthGuard> 
  },
  { 
    path: '/admin', 
    element: <AdminGuard><AdminDashboard /></AdminGuard> 
  },
  { 
    path: '/admin/uploads', 
    element: <AdminGuard><AllUploads /></AdminGuard> 
  },
  { 
    path: '/admin/blockchain', 
    element: <AdminGuard><BlockchainExplorer /></AdminGuard> 
  },
  { path: '/unauthorized', element: <Unauthorized /> },
  { path: '*', element: <NotFound /> },
]

export default routes