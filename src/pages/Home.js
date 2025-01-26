import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageSpinner from "../Components/Spinner";
import { useUserAuth } from "../context/UserAuthContext";

const Home = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/app");
    } else {
      navigate("/signin");
    }
  }, [user, navigate]);

  return <PageSpinner />;
};

export default Home;
