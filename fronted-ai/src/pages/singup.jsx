import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const url = import.meta.env.VITE_SERVER_URL


function Singup() {

    const [form,setForm] = useState({
        email : "",
        password : ""
    });
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e)=>{
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const handleSignup = async (event)=>{
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${url}/auth/signup`,{
                method : "POST",
                headers : {
                    "Content-Type" :"application/json"
                },
                body : JSON.stringify(form)
            })

            const data = await response.json();
            if(response.ok){
                localStorage.setItem("user",JSON.stringify(data.user));
                navigate("/login")
            }else{
                alert(data.message || "signup failed");
            }
        } catch (error) {
            alert("signup something went wrong")
        }
        finally{
            setLoading(false)
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <form onSubmit={handleSignup} className="card-body">
          <h2 className="card-title justify-center">SignUp</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Singup