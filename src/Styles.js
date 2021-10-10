import React, {useState, useRef, useContext} from 'react';
import styled from "styled-components";
import { motion, useMotionValue } from "framer-motion";
import { useSpring, animated } from "react-spring"

export const ScreenWrap = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const CardArea = styled.div`
  display: flex;  
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12vh 12vh;
  font-style: normal;
  font-weight: 300;
  font-size: 29px;
  line-height: 38px;
  color: #F5F3E9;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
`

export const SwipeUp = styled.div`
  text-align:center;
  font-size: 14px;
  padding-bottom: 24px;
  opacity:.7;
`

export const TextArea = styled.div`
  padding-left:20px;
  width:80%;
  max-width:550px;
  font-style: normal;
  font-weight: 300;
  font-size: 29px;
  line-height: 38px;
  color: #F5F3E9;
  z-index:10;
  padding-bottom:60px;
  @media only screen and (min-width: 768px) {
    font-size: 56px;
    line-height: 1.3em;
    max-width: 950px;
  }
`

export const ContentArea = styled.div`
  display: flex;  
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left:20px;
  width:80%;
  font-style: normal;
  font-weight: 300;
  font-size: 29px;
  line-height: 38px;
  color: #F5F3E9;
  z-index:10;
`

export const DesktopWarning = styled.div`
  background-color: red;
  width: 160px;
  height: 120px;
  border-radius: 200px;
  text-align: center;
  position: fixed;
  top: 100px;
  padding: 80px 20px 0px 20px;
  font-size: 20px;
  right: -20px;
  top: -20px;
  transform: rotate(20deg);
@media only screen and (max-width: 700px) {
  display:none;
}
`

export const BottomBar = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  z-index: 5;
  a {
    color: white;
    text-decoration: none;
    font-size: 16px;
    margin: 5px;
  }
`


export const TextButton = styled(motion.div)`
  color: white;
  font-size: 16px;
  margin: 5px;
  flex: ${props => props.stretch ? '1' : '0'};
`


export const Button = styled(motion.div)`
  flex: 1;
  text-align: center;
  font-size: 6vw;
  line-height: 4em;
  letter-spacing: 0;
  color: #030303;
  background: white;
  padding: 4vw;
  border-radius: 40vw;
  cursor: default;
`

export const TitleBox = styled.div`
  background-color: #70856A;
  width: 80px;
  color: black;
  padding: 12px;
  margin-top: 30vw;
  z-index: 10;
  border-radius: 1px;
  margin-bottom:40px;
  @media only screen and (min-width: 768px) {
    margin-top: 10vh;
  }
`

export const Circles = styled.div`
position: fixed;
left: 50%;
width: 800px;
margin-left: -400px;
margin-top: -20px;
z-index:1;
@media only screen and (min-width: 768px) {
  margin-top:12vh;
}
`

export const CloseButton = (props) => 
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="23.5" cy="23.5" r="23.5" fill="white"/>
    <path d="M14.1208 14.1208L32.8792 32.8792" stroke="black" strokeWidth="3" strokeLinecap="round"/>
    <path d="M14.1208 32.8792L32.8792 14.1208" stroke="black" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  </motion.div>

export const PinIcon = () =>
    <svg width="13" height="19" viewBox="0 0 13 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.49999 0C3.17657 0 0.166656 2.69404 0.166656 6.01825C0.166656 9.34167 2.91295 13.3095 6.49999 19C10.087 13.3095 12.8333 9.34167 12.8333 6.01825C12.8333 2.69404 9.8242 0 6.49999 0ZM6.49999 8.70833C5.1882 8.70833 4.12499 7.64512 4.12499 6.33333C4.12499 5.02154 5.1882 3.95833 6.49999 3.95833C7.81178 3.95833 8.87499 5.02154 8.87499 6.33333C8.87499 7.64512 7.81178 8.70833 6.49999 8.70833Z" fill="white" fillOpacity="0.8"/>
    </svg>

export const SubmitArrow = () =>
    <svg width="33" height="40" viewBox="0 0 33 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 20H0" stroke="#F2EBCF" strokeWidth="2"/>
    <path d="M26 26L32 20L26 14" stroke="#F2EBCF" strokeWidth="2" strokeLinejoin="round"/>
    </svg>


export const Box = styled(animated.div)`
    background: ${props => props.cover ? '#70856A' : '#F5F3E9'};
    color: ${props => props.cover ? 'white' : 'black'};
    position: absolute;
    left: -140px;
    top: -150px;
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    text-align: center;
    border-radius: 2px;
    width: 200px;
    height: 200px;
    padding: 36px;
    font-size: 30px;
    line-height:40px;
    border: 1px solid #0B0B0B;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
`;