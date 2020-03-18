import React, {useState, useRef, useContext} from 'react';
import styled from "styled-components";
import { motion, useMotionValue } from "framer-motion";
import { useSpring, animated } from "react-spring"

export const ScreenWrap = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const ContentArea = styled.div`
  display: flex;  
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12vh 24vh;
`

export const BottomBar = styled.div`
  display: flex;
  align-items: center;
  padding: 12vw 12vw;
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


export const Box = styled(animated.div)`
    position: absolute;
    left: -136px;
    top: -136px;
    display: flex;  
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: white;
    border-radius: 12px;
    width: 200px;
    height: 200px;
    padding: 36px;
    font-size: 24px;
    text-transform: uppercase;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.18);
`;