import React, {useState, useRef, useContext} from 'react';
import { motion, useMotionValue } from "framer-motion";
import styled from "styled-components";
import { StoreContext, StoreProvider } from './Store'
import { City } from './City'
import { Card } from './Card'
import { observer } from 'mobx-react'
import { ScreenWrap, ContentArea, BottomBar, TextButton, Button, CloseButton } from './Styles'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export const App = observer(() => {
  const store = useContext(StoreContext)
  return (
    <ScreenWrap>
      {store.mode == 0 && <Home/>}
      {store.mode == 1 && <City/>}
      {store.mode == 2 && <History/>}
      {store.mode == 3 && <Recap/>}
    </ScreenWrap>
  )
})

const Recap = observer(() => {
  const store = useContext(StoreContext)
  return (
    <ScreenWrap>
      <BottomBar><TextButton onTap={()=> { store.startDrift() }} stretch>Done</TextButton></BottomBar>
      <ContentArea>{store.currentDriftStory}</ContentArea>
    </ScreenWrap>
  )
})

const History = observer(() => {
  const store = useContext(StoreContext)
  return (
    <ScreenWrap>
            <BottomBar><TextButton onTap={()=> { store.startDrift() }} stretch>Done</TextButton></BottomBar>

      <ContentArea>{store.story}</ContentArea>
      
    </ScreenWrap>
  )
})

const HomeMenu = observer(() => {
  const store = useContext(StoreContext)
  return (
  <BottomBar>
    <TextButton>About</TextButton>
    <TextButton onTap={()=> { store.mode = 2; }}>History</TextButton>
  </BottomBar>
  )
})


const WanderMenu = observer(() => {
  const store = useContext(StoreContext)
  return (
  <BottomBar>
    <TextButton onTap={()=> { store.startDrift() }} stretch>Cancel</TextButton>
    <TextButton>{new Date(store.t - store.started).toISOString().substr(14, 5)}</TextButton>
    <TextButton onTap={()=> { store.pickCity() }}>Done</TextButton>
  </BottomBar>
  )
})



const Home = observer(() => {
  const store = useContext(StoreContext)
  const outerRef = useRef();
  const randAngleForString = (t,i=0) => {
    const rand = [-1,3,-2,2,-3,4,-1,-4];
    let c = t.charCodeAt(i % t.length) % t.length % rand.length
    return rand[c]
  }
  let cover = {t:'Wander and wonder wherever you are', cover: true}
  return (
    <ScreenWrap>
      {store.started ? <WanderMenu/> : <HomeMenu/>}
      <ContentArea>
        <div
          style={{position: 'absolute'}} 
          ref={outerRef}
        >
          {store.currentDrift?.prompts.slice().reverse().map((p,i) => (
            <Card 
              outerRef={outerRef}
              key={store.drifts.length+ " " +p.id}
              initialAngle={randAngleForString(p.t,p.id)}
              prompt={p}
              onMove={(d)=>{
                if (d.y>100) {
                  p.add = true;
                  p.added = new Date();
                } else if (Math.abs(d.x) + Math.abs(d.y) < 100) {} else p.add = false;
              }}
              // onUp={()=>{store.saveDrift()}}
              snap={{
                x:0, 
                y:p.added ? 400 : p.add == undefined ? 0 : -800, 
                r:randAngleForString(p.t,p.add?4:p.id),
                z:p.added ? p.id+20 : 10
              }}
            />
          ))}
          <Card 
            outerRef={outerRef}
            key={store.drifts.length}
            initialAngle={0}
            prompt={cover}
            initialY={store.started ? 400 : 0}
            onMove={(d)=>{
              if (d.y>100) {
                store.started = store.t;
              }
            }}
            snap={{
              x:0, 
              y:store.started ? 400 : 0, 
              r:0,
              z: 10
            }}
          />
        </div>
      </ContentArea>
    </ScreenWrap>
  )
})
