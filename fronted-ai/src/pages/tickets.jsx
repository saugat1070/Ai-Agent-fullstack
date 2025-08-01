import React from 'react'
import LoginSucessPopUp from '../../components/loginSucessPopUp'
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const url = import.meta.env.VITE_SERVER_URL

function Tickets() {
  const [showPopup, setShowPopup] = useState(true);
  const [form,setForm] = useState({
    title : "",
    description : ""
  });
  const [ticket,setTicket] = useState([]);
  const [loading,setLoading] = useState(false)

  const token = localStorage.getItem("token");

  const fetchTicket = async ()=>{
    try {
      const response = await fetch(`${url}/ticket`,{
        headers : {
          Authorization : `Bearer ${token}`
        },
        method : "GET"
      });

      const data = response.json();
      setTicket(data.tickets || []);
    } catch (error) {
      console.error("Failed to fetch tickets:",error);
    }
  }
  useEffect(()=>{
    const timer = setTimeout(()=>{
      setShowPopup(false)
    },3000);
    return ()=> clearTimeout(timer);
  },[]);

  useEffect(()=> {fetchTicket()},[]);
  const handleChange = (event)=> setForm({
    ...form,
    [event.target.name] : event.target.value
  })

  return (
    <>
      <div
        className={`mt-15 z-50 transition-all duration-500 ease-in-out right-10 ${
          showPopup ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <LoginSucessPopUp />
      </div>
      <div className='p-4 max-w-3xl mx-auto'>
        <h2 className='text-2xl font-bold mb-4'>Create Ticket</h2>
        


        <h2 className='text-xl font-semibold mb-2'>All Tickets</h2>
        <div className='space-y-3'>
          {
            ticket.map((tic)=>(
              <Link
              key = {tic._id}
              className='card shadow-md p-4 bg-gray-800'
              to={`/ticket/${tic._id}`}
              >
                <h3 className='font-bold text-lg'>{tic.title}</h3>
                <p className='text-sm'>{tic.description}</p>
                <p className='text-sm text-gray-500'>
                  CreatedAt : {new Date(tic.createdAt).toLocaleString()}
                </p>
              </Link>
            ))
          }

         {ticket.length === 0 && <p>no ticket submitted yet</p>} 
        </div>

      </div>
    </>
  );
}

export default Tickets