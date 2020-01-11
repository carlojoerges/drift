import React, {useState, useRef, useContext} from 'react';
import { motion, useMotionValue } from "framer-motion";
import { useSpring, animated } from "react-spring"
import styled from "styled-components";
import { StoreContext, StoreProvider } from './Store'
import { Card } from './Card'

const ScreenWrap = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const App = () => {
  const {store, setStore} = useContext(StoreContext)

  return (
    <ScreenWrap>
      {store.mode == 0 && <Home/>}
      {store.mode == 1 && <Drift/>}
    </ScreenWrap>
  )
}
const ContentArea = styled.div`
  display: flex;  
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12vh 24vh;
`

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  padding: 12vw 12vw;
`
const Button = styled(motion.div)`
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

const Home = () => {
  const {store, setStore} = useContext(StoreContext)
  const newDrift = () => {
    setStore({
      mode: 1,
      currentDrift: store.drifts.length,
      drifts: [{
        prompts: store.nextPrompts
      }]
    })
  }
  return (
    <ScreenWrap>
      <ContentArea></ContentArea>
      <BottomBar>
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onTap={()=>newDrift()}
        >Start Drift</Button>
      </BottomBar>
    </ScreenWrap>
  )
}

const CloseButton = (props) => 
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

const Drift = () => {
  const {store, setStore} = useContext(StoreContext)
  const randAngleForString = (t,i=0) => {
    const rand = [-1,3,-.6,1.2,-2.1,2.5];
    let c = t.charCodeAt(i) % t.length % rand.length
    return rand[c]
  }
  const togglePrompt = (pi,st) => {
    store.drifts[store.currentDrift].prompts[pi].add = st
    
    setStore(store)
  }
  // console.log(store.drifts[store.currentDrift].prompts[1].add)
  return (
    <ScreenWrap>
      <BottomBar>
        <CloseButton onTap={()=> setStore({mode: 0})}/>
      </BottomBar>
      <ContentArea>
        {store.drifts[store.currentDrift].prompts.map((p,i) => (
          <Card 
            key={i}
            initialAngle={randAngleForString(p.t)}
            prompt={p}
            onMove={(d)=>{if (d.y>100) togglePrompt(i,true); else togglePrompt(i,false);}}
            snap={{x:0, y:p.add?200:0, r:randAngleForString(p.t,3)}}
          />
        ))}
      </ContentArea>
    </ScreenWrap>
  )
}
