import React, { useEffect, useRef } from 'react'
import colors from './const';
import './home.css';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const appRef = useRef(null);

  useEffect(() => {
    const moveGradient = (event) => {
      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;
  
      // const mouseX = Math.round((event.pageX / winWidth) * 100);
      const mouseY = Math.round((event.pageY / winHeight) * 100);
      let mouseX = 60;
      if(appRef){
        appRef.current.style.setProperty("--mouse-x", mouseX.toString() + "%");
        appRef.current.style.setProperty("--mouse-y", mouseY.toString() + "%");
      }
    };
  
    document.addEventListener("mousemove", moveGradient);
  
    return function cleanup() {
      document.removeEventListener("mousemove", moveGradient);
    };
  }, [appRef]);
  
  let navigate = useNavigate();
  
  return (
    <div className='app' ref={appRef} data-scroll-container style={styles.appWrapper}>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Press+Start+2P&display=swap');
      </style>
    
      <div style={styles.container}>
        <h3  style={styles.tag}>Want to Solve</h3>
        <h3  className='stroked-tag'>World Hunger?</h3>

        {/* <h2 style={styles.heading}>CROPWISE</h2>
        <h2 className='stroked-text'>AI</h2> */}

        <h1 style={styles.small}>
        We use MIRA COMPOUND FLOW to help farmers maximize their yield and profits,<br></br> and work towards solving food shortages.
        </h1>

        <h1 style={styles.small}>
        Using CropWise AI will have an impact at the ground level and help farmers make informed decisions about crops, seasons, modern methods, fertilizers, companion crops, soil health, and much more.
        </h1>


        <h1 style={styles.small}>
          Every year, nearly 14% of the world's food production is 
          lost before it even<br></br> reaches consumers due to inefficiencies
          in farming practices and post-harvest handling.
        </h1>

        <h1 style={styles.small}>
          Farmers using outdated methods lose up to 30% of their yield annually,<br></br>
          highlighting the need for better education and modern agricultural tools.
        </h1>

        <button onClick={()=>{navigate("/form")}} style={styles.buttonStyle}>
          Get Started
        </button>
      </div>
    </div>
  )
}

const styles = {
  appWrapper: {
    minHeight: '100vh',
    width: '100%',
    margin: -8,
    padding: 0,
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    backgroundColor: 'black',
    overflow: 'hidden',
  },
  heading: {
    fontSize: 80,
    fontWeight: 'bold',
    textAlign: 'start',
    fontFamily: 'Poppins, sans-serif',
    color: 'white',
    marginStart: '1rem',
    margin: 0,
    
  },
  tag: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'start',
    fontFamily: 'Poppins, sans-serif',
    color: 'white',
    margin:0
  },
  text:{
    fontSize: 40,
    textAlign: 'start',
    fontFamily: 'Poppins, sans-serif',
    color: 'white',
    padding: '1rem',
    margin:50,

  },
  small:{
    fontSize: 20,
    textAlign: 'start',
    fontFamily: 'Poppins, sans-serif',
    color: '#bababa',
    padding: '1rem',
    fontWeight: 400,
    margin: 0,
  },
  container:{
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor:'black',
    minHeight: '100vh',
    padding: '2rem',
  },
  buttonStyle:{
    padding: '16px 32px',
    border: '2px solid white',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    margin: '1rem',
    alignSelf: 'flex-start',
  }
}

export default Home;