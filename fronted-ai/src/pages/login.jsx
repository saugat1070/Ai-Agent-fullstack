import React from 'react'
import { useNavigate } from 'react-router-dom';


function Login() {
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

    const handleLogin = async (event)=>{
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${url}/auth/login`,{
                method : "POST",
                headers : {
                    "Content-Type" :"application/json"
                },
                body : JSON.stringify(form)
            })

            const data = await response.json();
            if(response.status == 200){
                localStorage.setItem("token",data.token);
                localStorage.setItem("user",JSON.stringify(data.user));
                navigate("/")
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
    <div>login</div>
  )
}

export default Login