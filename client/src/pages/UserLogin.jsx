import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import {toast} from 'react-hot-toast'
import axios from 'axios'
const UserLogin = () => {
  const [type, setType] = useState('sign-in')
  const [isLoading, setIsLoading] = useState(false)

  // Common fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Sign-up only fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address1, setAddress1] = useState('')
  const [city, setCity] = useState('')
  const [stateField, setStateField] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [ssn, setSSN] = useState('')

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const formData = {
      email,
      password,
      ...(type === 'sign-up' && {
        firstName,
        lastName,
        address1,
        city,
        state: stateField,
        postalCode,
        dateOfBirth,
        ssn,
      }),
    };

    const {data} = await axios.post(
      "http://localhost:4000/api/auth/request-otp",
      formData,
      { withCredentials: true }
    );

    if (data.success) {
      navigate("/email-verify"); //Navigate only after success
    } else {
      toast.error("Failed to send OTP");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className={`min-h-screen ${type === 'sign-in' && 'flex items-center'} w-full bg-[url('userbg.jpg')] bg-cover bg-center bg-fixed `}>
    <section className="auth-form px-6 border-2 rounded-2xl bg-white backdrop-blur-md shadow-[0_0_20px_rgba(25,192,254,2.5)] border-cyan-600 py-10 max-w-110 max-md:mx-auto max-md:mt mx-10">
      <header className="flex flex-col gap-5 mb-6 ">
        <Link to="/" className="flex items-center gap-2">
          <img src={assets.bankofmaha} alt="Bank logo" className="w-110 mx-auto" />
          
        </Link>
        <div className="flex flex-col mt-[-20px] items-center gap-3 justify-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </h1>
          <p className="text-sm text-gray-600">
            {type === 'sign-in' ? 'Please enter your credentials' : 'Please fill in your details'}
          </p>
        </div>
      </header>

     <form onSubmit={handleSubmit} className="space-y-4">
  {type === 'sign-up' && (
    <>
      <div className="flex gap-4">
        <div className="w-1/2">
          <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2">
          <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address1" className="block mb-1 text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          id="address1"
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
          placeholder="Address"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
          <label htmlFor="stateField" className="block mb-1 text-sm font-medium text-gray-700">
            State
          </label>
          <input
            id="stateField"
            value={stateField}
            onChange={(e) => setStateField(e.target.value)}
            placeholder="State"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      <div className="flex gap-4">
        <div>
        <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-700">
          City
        </label>
        <input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
       </div>  
      
        <div className="w-1/2">
          <label htmlFor="postalCode" className="block mb-1 text-sm font-medium text-gray-700">
            Postal Code
          </label>
          <input
            id="postalCode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Postal Code"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label htmlFor="dateOfBirth" className="block mb-1 text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            placeholder="YYYY-MM-DD"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2">
          <label htmlFor="ssn" className="block mb-1 text-sm font-medium text-gray-700">
            SSN (e.g. 1234)
          </label>
          <input
            id="ssn"
            value={ssn}
            onChange={(e) => setSSN(e.target.value)}
            placeholder="SSN"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </>
  )}

  <div>
    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
      Email
    </label>
    <input
      id="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      type="email"
      placeholder="Email"
      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div>
    <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
      Password
    </label>
    <input
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      type="password"
      placeholder="Password"
      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <button
  type="submit"
  disabled={isLoading}
  className={`w-full text-white py-2 rounded transition duration-200 ${
    isLoading
      ? 'bg-blue-400 cursor-not-allowed opacity-70'
      : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
  }`}
>
  {isLoading ? 'Loading...' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
</button>

</form>


      <footer className="flex justify-center mt-4 gap-1">
        <p className="text-sm text-gray-600">
          {type === 'sign-in' ? "Don't have an account?" : "Already have an account?"}
        </p>
        <button
          onClick={() => setType(type === 'sign-in' ? 'sign-up' : 'sign-in')}
          className="text-sm cursor-pointer text-blue-600 underline ml-1"
        >
          {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
        </button>
      </footer>
    </section>
    </div>
  )
}

export default UserLogin
