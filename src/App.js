import React, {useState, useRef, useContext} from 'react';
import { motion, useMotionValue } from "framer-motion";
import styled from "styled-components";
import { StoreContext, StoreProvider } from './Store'
import { City } from './City'
import { Card } from './Card'
import { observer } from 'mobx-react'
import { ScreenWrap, ContentArea, BottomBar, TextButton, Button,Circles, CloseButton, CardArea, TitleBox, TextArea, DesktopWarning, SwipeUp,SwipeDown,TextBlock, YourStory, YourStoryHeading} from './Styles'
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
      {store.mode == 4 && <About/>}
    </ScreenWrap>
  )
})

const Recap = observer(() => {
  const store = useContext(StoreContext)
  return (
    <ScreenWrap>
      <BottomBar>
        <YourStoryHeading>Wander Prompts </YourStoryHeading>
        <TextButton onTap={()=> { store.startDrift() }} stretch>
         <svg style={{float: 'right'}}  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.5"><path fillRule="evenodd" clipRule="evenodd" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="white"></path></g></svg>
      </TextButton>
      </BottomBar>
      <YourStory><p>{store.currentPersonalStory}</p></YourStory>
      <Circles>
        <svg width="819" height="708" viewBox="0 0 819 708" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M633.153 262.929C652.85 308.736 645.671 361.006 618.066 408.508C590.461 456.01 542.444 498.712 480.545 525.328C418.646 551.944 354.621 557.419 301.155 544.776C247.688 532.134 204.814 501.387 185.117 455.579C165.42 409.771 172.598 357.502 200.203 310C227.808 262.498 275.825 219.795 337.725 193.179C399.624 166.564 463.649 161.089 517.115 173.731C570.581 186.374 613.456 217.121 633.153 262.929Z" stroke="#70856A"/>
        <path d="M754.3 434.307C719.189 584.845 536.316 671.057 345.642 626.584C154.968 582.112 29.1059 423.891 64.2169 273.354C99.3279 122.817 282.201 36.6049 472.875 81.0773C663.549 125.55 789.411 283.77 754.3 434.307Z" stroke="#70856A"/>
        </svg>
      </Circles>
    </ScreenWrap>
  )
})

const History = observer(() => {
  const store = useContext(StoreContext)
  return (
    <ScreenWrap>
      <HomeMenu/>
      <DesktopWarning>Grab your phone and take a walk.</DesktopWarning>
      <TextBlock>
        <TextArea>
        <div style={{"color":"#70856A","display":"inline",}}>Wander Prompts</div> are a set of prompts for a slow, observational walk right where you are.<br/><br/>
        They can guide you to get to know your own city more intimately. Or, just give you an excuse to walk outside.
        </TextArea>
        <TextArea><div style={{"color":"#70856A","display":"inline",}}>For example</div>, {store.story}</TextArea>
        <TextArea>*</TextArea>
        <TextArea>Wander Prompts were created by H.Jaramillo and developed by C.Joerges. They were inspired by Derives and Yi-Fu Tuan. We recognize not everyone will always feel safe taking a purposeless walk, but hope this serves as a reminder that you absolutely have the right to do so.</TextArea>
      </TextBlock>
      <Circles>
        <svg width="819" height="708" viewBox="0 0 819 708" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M633.153 262.929C652.85 308.736 645.671 361.006 618.066 408.508C590.461 456.01 542.444 498.712 480.545 525.328C418.646 551.944 354.621 557.419 301.155 544.776C247.688 532.134 204.814 501.387 185.117 455.579C165.42 409.771 172.598 357.502 200.203 310C227.808 262.498 275.825 219.795 337.725 193.179C399.624 166.564 463.649 161.089 517.115 173.731C570.581 186.374 613.456 217.121 633.153 262.929Z" stroke="#70856A"/>
        <path d="M754.3 434.307C719.189 584.845 536.316 671.057 345.642 626.584C154.968 582.112 29.1059 423.891 64.2169 273.354C99.3279 122.817 282.201 36.6049 472.875 81.0773C663.549 125.55 789.411 283.77 754.3 434.307Z" stroke="#70856A"/>
        </svg>
      </Circles>
    </ScreenWrap>
  )
})

const About = observer(() => {
  const store = useContext(StoreContext)
  return (
    <ScreenWrap>
         <HomeMenu/>
      <TitleBox>About</TitleBox>
      <TextArea>
      <div style={{"color":"green important!"}}>Wander Prompts </div> are a set of prompts for a slow, observational walk right where you are. <br/><br/>
      They can help you notice things you haven’t seen before, or think about spaces in new ways. 
      <br/><br/>They were created by H. Jaramillo and C. Joerges.
      </TextArea>
      <Circles>
        <svg width="819" height="708" viewBox="0 0 819 708" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M633.153 262.929C652.85 308.736 645.671 361.006 618.066 408.508C590.461 456.01 542.444 498.712 480.545 525.328C418.646 551.944 354.621 557.419 301.155 544.776C247.688 532.134 204.814 501.387 185.117 455.579C165.42 409.771 172.598 357.502 200.203 310C227.808 262.498 275.825 219.795 337.725 193.179C399.624 166.564 463.649 161.089 517.115 173.731C570.581 186.374 613.456 217.121 633.153 262.929Z" stroke="#70856A"/>
        <path d="M754.3 434.307C719.189 584.845 536.316 671.057 345.642 626.584C154.968 582.112 29.1059 423.891 64.2169 273.354C99.3279 122.817 282.201 36.6049 472.875 81.0773C663.549 125.55 789.411 283.77 754.3 434.307Z" stroke="#70856A"/>
        </svg>
      </Circles>
    </ScreenWrap>
  )
})

const HomeMenu = observer(() => {
  const store = useContext(StoreContext);
  let active = (store.mode == 0);
  return (
  <BottomBar>
    <TextButton onTap={()=> { store.mode = 0 }}   style={{"opacity":"${ active ?  '.5' : '1'};"}}>Wander</TextButton>
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
    <TextButton>/</TextButton>
    <TextButton onTap={()=> { store.pickCity() }}>Done</TextButton>
  </BottomBar>
  )
})



const Home = observer(() => {
  const store = useContext(StoreContext)
  const outerRef = useRef();
  const randAngleForString = (t,i=0) => {
    const rand = [-1,3,-2,2,-3,4,-1,-4];
    let c = t.charCodeAt(i % t.length) % t.length % rand.length;
    return rand[c]
  }
  let cover = {t:'Wander and wonder right where you are.', cover: true}
  return (
    <ScreenWrap>
      {store.started ? <WanderMenu/> : <HomeMenu/>}
      <DesktopWarning>Grab your phone and take a walk.</DesktopWarning>
      {(store.started != 0 && store.currentDrift.prompts.length < 4) && <SwipeUp> Skip it? Swipe up. </SwipeUp>}
      <CardArea>
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
      </CardArea>
      {(store.started == 0 && store.currentDrift.prompts.length < 4) && <SwipeDown>Ready to walk? Swipe down.</SwipeDown>}
      {(store.started != 0 && store.currentDrift.prompts.length < 4) && <SwipeDown>Tried it? Swipe down.</SwipeDown>}
      <Circles>
        <svg width="819" height="708" viewBox="0 0 819 708" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M633.153 262.929C652.85 308.736 645.671 361.006 618.066 408.508C590.461 456.01 542.444 498.712 480.545 525.328C418.646 551.944 354.621 557.419 301.155 544.776C247.688 532.134 204.814 501.387 185.117 455.579C165.42 409.771 172.598 357.502 200.203 310C227.808 262.498 275.825 219.795 337.725 193.179C399.624 166.564 463.649 161.089 517.115 173.731C570.581 186.374 613.456 217.121 633.153 262.929Z" stroke="#70856A"/>
        <path d="M754.3 434.307C719.189 584.845 536.316 671.057 345.642 626.584C154.968 582.112 29.1059 423.891 64.2169 273.354C99.3279 122.817 282.201 36.6049 472.875 81.0773C663.549 125.55 789.411 283.77 754.3 434.307Z" stroke="#70856A"/>
        </svg>
      </Circles>
      
    </ScreenWrap>
  )
})
