import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryView from "./DirectoryView";
import Register from "./Register";
import Login from "./Login";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Layout from "./components/Layout";
import Trash from "./pages/Trash";
import Settings from "./pages/Settings";
import ComingSoon from "./pages/ComingSoon";
import Contact from "./pages/Contact";   // 👈 import Contact component
import FAQ from "./pages/FAQ";
import Careers from "./pages/Careers";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/features",
    element: <Features />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      { index: true, element: <DirectoryView /> },
      { path: "directory/:dirId", element: <DirectoryView /> },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/trash",
    element: <Trash />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/starred",
    element: <ComingSoon />,
  },
  // 👇 Contact route (add this)
  {
    path: "/contact",
    element: <Contact />,
  },
   {
    path: "/faq",
    element: <FAQ />,
  },
  {
  path: "/careers",
  element: <Careers />,
},
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;