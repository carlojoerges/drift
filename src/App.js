import React, {useState, useRef, useContext} from 'react';
import { motion, useMotionValue } from "framer-motion";
import styled from "styled-components";
import { StoreContext, StoreProvider } from './Store'
import { City } from './City'
import { Card } from './Card'
import { observer } from 'mobx-react'
import { ScreenWrap, ContentArea, BottomBar, Button, CloseButton } from './Styles'


export const App = observer(() => {
  const store = useContext(StoreContext)
  return (
    <ScreenWrap>
      {store.mode == 0 && <Home/>}
      {store.mode == 1 && <City/>}
      {store.mode == 2 && <Drift/>}
    </ScreenWrap>
  )
})


const Home = observer(() => {
  const store = useContext(StoreContext)
  return (
    <ScreenWrap>
      <ContentArea>{store.story}</ContentArea>
      <BottomBar>
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onTap={()=>store.startDrift()}
        >Start Drift</Button>
      </BottomBar>
    </ScreenWrap>
  )
})



const Drift = observer(() => {
  const store = useContext(StoreContext)
  const outerRef = useRef();
  const randAngleForString = (t,i=0) => {
    const rand = [-1,3,-2,2,-3,4,-1,-4];
    let c = t.charCodeAt(i % t.length) % t.length % rand.length
    return rand[c]
  }

  return (
    <ScreenWrap>
      <BottomBar>
        <CloseButton onTap={()=> { store.returnHome() }}/>
      </BottomBar>
      <ContentArea>
        <div
          style={{position: 'absolute'}} 
          ref={outerRef}
        >
          {store.currentDrift?.prompts.slice().reverse().map((p,i) => (
            <Card 
              outerRef={outerRef}
              key={p.id}
              initialAngle={randAngleForString(p.t,p.id)}
              prompt={p}
              onMove={(d)=>{
                if (d.y>100) {
                  p.add = true;
                  p.added = new Date();
                } else if (Math.abs(d.x) + Math.abs(d.y) < 100) {} else p.add = false;
              }}
              onUp={()=>{store.saveDrift()}}
              snap={{
                x:0, 
                y:p.added ? 400 : p.add == undefined ? 0 : -400, 
                r:randAngleForString(p.t,p.add?4:p.id)
              }}
            />
          ))}
        </div>
      </ContentArea>
    </ScreenWrap>
  )
})
