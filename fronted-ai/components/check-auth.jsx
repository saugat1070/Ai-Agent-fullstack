import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Preloader from "./preloader";


function CheckAuth({ children, protectedRoute }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(children,protectedRoute)
    if(protectedRoute){
     if(!token){
        navigate("/login");
     }else{
        setLoading(false)
     }   
    }else{
        if(token){
            navigate("/");
        }else{
            setLoading(false)
        }
    }
  }, [navigate, protectedRoute]);

  if (loading) {
    return (
      <div
      className="flex flex-row justify-center items-center h-[50rem] fixed w-full"
      >
        <Preloader/>
      </div>
    );
  }
  return children;
}

export default CheckAuth;
