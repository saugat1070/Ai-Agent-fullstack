import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'

function Admin() {
    console.log("I am at Admin pannel section");
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
        console.log(data)
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
        setEditingUser(users.email);
        setFormData({
            role : users?.role,
            skils : users?.skils?.join(", "),
        });
    }

    const handleUpdate = async ()=>{
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/update-user`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${token}`
                },
                body : JSON.stringify({
                    email : edititngUser,
                    role : formData.role,
                    skils : formData.skils
                    .split(",")
                    .map((skil)=> skil.trim())
                    .filter(Boolean)
                })
            });

            const data = await response.json();
            if(!response.ok){
                console.error(data.error || "Failed to update user");
                return;
            }

            setEditingUser(null);
            setFormData({
                role : "",skils:""
            });
            fetchUsers();
        } catch (error) {
            console.error("Update failed:",error.message);
        }
    }
    const handleSearch = (event)=>{
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        setFilter(
            users.filter((user)=>user.email.toLowerCase().includes(query))
        )
    }
    
  return (
    <div className='max-w-4xl mx-auto mt-10'>
        <h1 className='text-2xl font-bold mb-6'>Admin Panel - Manange Users</h1>
        <input type="text"
        className='input input-bordered w-full mb-6'
        placeholder='search by email'
        value = {searchQuery}
        onChange={handleSearch}
        />
        {filter.map((user)=>(
            <div
            key={user._id}
            className='bg-base-100 shadow rounded p-4 mb-4 border'>
                <p>
                    <strong>Email:</strong>{user.email}
                </p>
                <p>
                    <strong>Current Role:</strong>{user.role}
                </p>
                <p>
                    <strong>Skils:</strong>{" "}
                    {user.skils && user.skils.length > 0 ? user.skils.join(", ") : "N/A"}
                </p>

                {
                    edititngUser === user.email ? (
                        <div className='mt-4 space-y-2'>
                            <select
                            className='select select-bordered w-full'
                            value={formData.role}
                            onChange={(event)=>{
                                return setFormData({
                                    ...formData,
                                    role : event.target.value
                                })
                            }}
                            >
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                            </select>

                            <input type="text"
                            placeholder='comma-separated skils'
                            className='input input-bordered w-full'
                            value={formData.skils}
                            onChange={(event)=>{
                                return setFormData({
                                    ...formData,
                                    skils : event.target.value
                                })
                            }}
                            />

                            <div className='flex gap-2'>
                                <button
                                className='btn btn-success btn-sm'
                                onClick={handleUpdate}
                                >
                                    Save
                                </button>

                                <button
                                className='btn btn-ghost btn-sm'
                                onClick={()=> setEditingUser(null)}
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>
                    ) : <button
                    className='btn btn-primary btn-sm mt-2'
                    onClick={()=> handleEditClick}
                    >
                        Edit
                    </button>
                }
            </div>
        ))}
    </div>
  )
}

export default Admin;