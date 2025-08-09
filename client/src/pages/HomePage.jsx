import React from 'react'
import Navbar from '../components/Navbar';
import HomeMain from '../components/HomeMain';
import HomeOption from '../components/HomeOption';
import ChatBot from '../components/ChatBot';

/**
 * HomePage - Renders the main landing content and options for the user.
 * Components:
 * - HomeMain: Hero section or introduction
 * - HomeOption: Feature highlights or user actions
 */

const HomePage = () => {
  return (
    <div>
        {/* <div className="fixed right-6 bottom-6 z-50">
        <ChatBot />
        </div> */}
  
     <HomeMain />
     <HomeOption />
    </div>
  )
}

export default HomePage;
