import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer";
import Sidebar from "../Components/sidebar";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div>
        <main className="flex-1 ">
          {/* <Sidebar /> */}
          <Outlet />
        </main>
      </div>
      <footer className="fixed bottom-0 z-50 left-0 right-0 bg-cards3 py-4">
        <Footer />
      </footer>
    </div>
  );
};

export default AuthLayout;
