import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'

function Admin() {
    const [users,setUsers] = useState([]);
    const [filter,setFilter] = useState([]);
    const [edititngUser,setEditingUser] = useState(null);
    const [formData,setFormData] = useState({
        role : "",
        skils : ""
    });
    const [searchQuery,setSearchQuery] = useState("");

    const token = localStorage.getItem("token");

    useEffect(()=>{
        fetchUsers();
    },[]);


    const fetchUsers = async ()=>{
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/getuser`,{
            headers : {
                "Authorization" : `Bearer ${token}`
            }
        });
        const data = response.json();
        if(response.status == 200){
            setUsers(data);
            setFilter(data)
        }else{
            console.error(data.error);
        }
        } catch (error) {
            console.log("Error fetching users",error);
        }
    }

    const handleEditClick = async ()=>{
        
    }
  return (
    <div>admin</div>
  )
}

export default Admin