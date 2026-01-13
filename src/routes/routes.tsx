import { createBrowserRouter } from "react-router-dom";
import MasterLayOut from "../layouts/MasterLayOut/MasterLayOut";
import Dashbaord from "../pages/Dashbaord/Dashbaord";
import Menu from "../pages/Menu/Menu";
import PrivateDining from "../pages/PrivateDining/PrivateDining";
import Gallery from "../pages/Gallery/Gallery";
import Contact from "../pages/Contact/Contact";
import NotFound from "../pages/NotFound/NotFound";
import MenuDetails from "../pages/Menu/MenuDetails";
import AuthLayOut from "../layouts/AuthLayOut/AuthLayOut";
import Login from "../pages/Auth/Login/Login";



export const routes = createBrowserRouter([
    {
        path : "/login",
        element : <AuthLayOut/>,
         errorElement: <NotFound/>,
         children:[
            {
                index : true,
                element : <Login/>,
            },
            {
                path : "login",
                element : <Login/>
            }
         ]
    },


    {
        path : "/",
        element: <MasterLayOut/>,
        errorElement: <NotFound/>,
        children: [
            {
                index: true,
                element: <Dashbaord/>

            },
            {
                path: "dashboard",
                element: <Dashbaord/>,

            },

            // menu route
            { path : "menu", element: <Menu/>  },
            { path : "menu/:id", element: <MenuDetails/>  },


            // private dining route
            { path : "private-dining", element: <PrivateDining/>  },


            // Gallery route
            { path : "gallery", element: <Gallery/>  },


            // contact route
            { path : "contact", element: <Contact/>  },

        ]
        
    },
    {
        path: "*",
        element:  <NotFound/>
    }
])