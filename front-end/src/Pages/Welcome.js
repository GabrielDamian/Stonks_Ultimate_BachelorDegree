import React from 'react';
import './Style/Welcome.css';
import HeroSection from '../Components/Organisms/HeroSection';

export default function Welcome()
{
    return(
        <div className='welcome-container'>
            <HeroSection/>
        </div>
    )
}