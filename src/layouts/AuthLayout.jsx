import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AuthLayout;
