import { createBrowserRouter } from "react-router-dom";
import MasterLayOut from "../layouts/MasterLayOut/MasterLayOut";
import Dashbaord from "../pages/Dashbaord/Dashbaord";
import Menu from "../pages/Menu/Menu";
import PrivateDining from "../pages/PrivateDining/PrivateDining";
import Gallery from "../pages/Gallery/Gallery";
import Contact from "../pages/Contact/Contact";
import NotFound from "../pages/NotFound/NotFound";
import MenuDetails from "../pages/Menu/MenuDetails";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import ForgetPassword from "../pages/Auth/ForgetPassword/ForgetPassword";
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword";
import AdminPanel from "../pages/Admin/AdminPanel/AdminPanel";
import AdminLayOut from "../layouts/AdminLayOut/AdminLayOut";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Categories from "../pages/Admin/Categories/Categories";
import AuthLayOut from "../layouts/AuthLayOut/AuthLayOut";
import Messages from "../pages/Admin/Messages/Messages";



export const routes = createBrowserRouter([
    {
  path: "/",
  element: <AuthLayOut />,
  errorElement: <NotFound />,
  children: [
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
    { path: "forget-password", element: <ForgetPassword /> },
    // { path: "reset-password", element: <ResetPassword /> },
  ],
},


    {
  path: "/admin",
  element: 
  [<ProtectedRoute> <AdminLayOut/> </ProtectedRoute>] ,
  children: [
    { index: true, element: <AdminPanel /> },
    { path: "categories", element: <Categories/> },
    { path: "messages", element: <Messages/> },
  ],
},


    {
  path: "/",
  element: <MasterLayOut />,
  errorElement: <NotFound />,
  children: [
    { index: true, element: <Dashbaord /> },
    { path: "dashboard", element: <Dashbaord /> },

    { path: "menu", element: <Menu /> },
    { path: "menu/:id", element: <MenuDetails /> },

    { path: "private-dining", element: <PrivateDining /> },
    { path: "gallery", element: <Gallery /> },
    { path: "contact", element: <Contact /> },
  ],
}

])