import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1  pb-16">
        <Outlet />
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-cards3 py-4">
        <Footer />
      </footer>
    </div>
  );
};

export default AuthLayout;
