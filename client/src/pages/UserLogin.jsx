import React, { useState , useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import {toast} from 'react-hot-toast'
import axios from 'axios'
import { AppContext } from "../context/AppContext";



const UserLogin = (props) => {
  // const flowOfSpeech = ["First Name", "Last Name"];
  // const flowOfInput = [setFirstName, setLastName];
  const [count, setCount] = useState(0);
  const { backendUrl} = useContext(AppContext);
  const navigate = useNavigate();
  const [type, setType] = useState(props.signUp?'sign-up':'sign-in')
  const [isLoading, setIsLoading] = useState(false)

  // Common fields
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  // Sign-up only fields
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  //Speech
    // const [listening, setListening] = useState(false);

  // Browser SpeechRecognition setup
  // const SpeechRecognition =
  //   window.SpeechRecognition || window.webkitSpeechRecognition;

  // const recognition = new SpeechRecognition();

  // recognition.continuous = false; // We only want one input
  // recognition.lang = 'en-US'; // Set language
  // recognition.interimResults = false; // Only final results
  // recognition.maxAlternatives = 1;

  //  const handleVoiceInput = () => {
  //   speakText()
  //   if (!SpeechRecognition) {
  //     alert('Speech Recognition not supported in your browser');
  //     return;
  //   }

  //   setListening(true);
  //   recognition.start();

  //   recognition.onresult = (event) => {
  //     const spokenName = event.results[0][0].transcript;
  //     setFirstName(spokenName);
  //     setListening(false);
  //   };

  //   recognition.onerror = (event) => {
  //     console.error('Speech recognition error:', event.error);
  //     setListening(false);
  //   };

  //   recognition.onend = () => {
  //     setListening(false);
  //   };
  // };
  //  const speakText = (text) => {
  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.lang = 'en-US'; // Set language
  //   speechSynthesis.speak(utterance);
  // };
 

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  console.log("clicked submit....")

  try {
    const formData = {
      phone,
      password,
      ...(type === 'sign-up' && {
        name: firstName + " "+ lastName,
        email
        // address1,
        // city,
        // state: stateField,
        // postalCode,
        // dateOfBirth,
        // ssn,
      }),
    };
    
     const {data} = await axios.post(

       (type === 'sign-up')?backendUrl + "/createUser/details": backendUrl +"/login",
       formData,
       { withCredentials: true }
     );

     if (data.success && type === 'sign-up') {
      navigate("/email-verify"); //Navigate only after success
     }else if(data.success){
      navigate("/admin"); //Navigate only after success
     }else {
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
      
    <section className="relative auth-form px-6 border-2 rounded-2xl bg-white backdrop-blur-md shadow-[0_0_20px_rgba(25,192,254,2.5)] border-cyan-600 py-10 max-w-110 max-md:mx-auto max-md:mt mx-10">
       {/* <button
       onClick={handleVoiceInput}
      disabled={listening}
      className={`absolute bottom-0 right-0 w-15 h-15 text-2xl text-white py-2 rounded-full transition duration-200 ${
    listening
      ? 'bg-blue-400 cursor-not-allowed opacity-70'
      : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
  }`}
>
  {/* {'🔊':listening ? 'Listening...' : '🎙️'} */}
{/* </button> */} 
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

  
    </>
  )}
 <div>
    <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
      Phone No.
    </label>
    <input
      id="phone"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      type="number"
      placeholder="XXXX-XXX-XXX"
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
