import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <main className="flex-1 overflow-auto p-4">
          <Outlet />  {/* Yahan DirectoryView ya other protected pages render honge */}
        </main>
      </div>
    </div>
  );
};

export default Layout;

