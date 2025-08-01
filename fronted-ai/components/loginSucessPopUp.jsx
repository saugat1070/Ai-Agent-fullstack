import React from 'react'

export default function LoginSucessPopUp() {
return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-2 text-green-500">🕶Login Successful!,<span className='opacity-70'>Welcome back</span></h2>
        </div>
    </div>
)
}

