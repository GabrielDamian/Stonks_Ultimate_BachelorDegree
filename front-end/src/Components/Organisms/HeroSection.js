import React from 'react'
import './HeroSection.css'
import BackgroundVideo from './BackgroundVideo.mp4'
import LogoIcon from '../../Media/logo.png';
import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
export default function HeroSection()
{

  const navigate = useNavigate();
  const redirectToHomePage = ()=>{
    navigate('/')
  }
  
  const particlesInit = useCallback(async engine => {
      await loadFull(engine);
    }, []);

  const particlesLoaded = useCallback(async container => {
      await console.log(container);
  }, []);


    return(
      <div className='hero-container'>
        <video src={BackgroundVideo} autoPlay loop muted />
        <div className='hero-top-bar'>
          <div className='hero-top-bar-logo'>
            <img onClick={redirectToHomePage} src={LogoIcon} alt="logo" />
          </div>
          <div className='hero-top-bar-navigation'>
            <div className='hero-top-bar-navigation-buttons'>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          </div>
        </div>
        <div className='hero-top-content'>
          <div className='hero-top-content-item-left'>
          <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              background: {},
              fpsLimit: 120,
              fullScreen: { enable: false },
              interactivity: {
                  events: {
                      onClick: {
                          enable: true,
                          mode: "push",
                      },
                      onHover: {
                          enable: true,
                          mode: "repulse",
                      },
                      resize: true,
                  },
                  modes: {
                      push: {
                          quantity: 4,
                      },
                      repulse: {
                          distance: 200,
                          duration: 0.4,
                      },
                  },
              },
              particles: {
                  color: {
                      value: "#ffffff",
                  },
                  links: {
                      color: "#ffffff",
                      distance: 150,
                      enable: true,
                      opacity: 0.5,
                      width: 1,
                  },
                  collisions: {
                      enable: true,
                  },
                  move: {
                      direction: "none",
                      enable: true,
                      outModes: {
                          default: "bounce",
                      },
                      random: false,
                      speed: 2,
                      straight: false,
                  },
                  number: {
                      density: {
                          enable: true,
                          area: 800,
                      },
                      value: 80,
                  },
                  opacity: {
                      value: 0.5,
                  },
                  shape: {
                      type: "circle",
                  },
                  size: {
                      value: { min: 1, max: 5 },
                  },
              },
              detectRetina: true,
          }}
        />
          </div>
          <div className='hero-top-content-item-right'>
            <div className='hero-top-content-item-right-title'>
              <span>Stonk Ultimate Bachelor Degree Ecosystem</span>
            </div>
            <div className='hero-top-content-item-right-desc'>
              <span>Lorem Ipsum is simply dum Ipy'sext ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</span>
            </div>
          </div>
        </div>
      </div>
    )
}