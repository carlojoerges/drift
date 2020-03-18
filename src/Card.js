import React, {useState, useRef} from 'react';

import { motion, useMotionValue } from "framer-motion";
import { useSpring, animated } from "react-spring"
import styled from "styled-components";
import { Box } from './Styles'


const addVec = (a,b) => ({x:a.x+b.x,y:a.y+b.y});
const subVec = (a,b) => ({x:a.x-b.x,y:a.y-b.y});
const multVec = (a,b) => ({x:a.x*b,y:a.y*b});
const lengthVec = (a) => Math.sqrt(a.x*a.x+a.y*a.y);


export const Card = ({outerRef, prompt,initialAngle=0, onMove=()=>{}, onUp=()=>{}, snap={x:0,y:0,r:0}}) => {
  const weight = 1;
  const inertia = 500;
  const breaking = 1.15;
  const snapPoint = useRef()
  snapPoint.current = snap
  const pos = useRef({x:0,y:0,r:initialAngle})
  const v = useRef({x:0,y:0})
  const vr = useRef(0);
  const m = useRef({x:-1,y:-1})
  const mlast = useRef({x:0,y:0})
  const [p, setP] = useState({x:0,y:0,r:initialAngle});
  

  const style = useSpring({
    config: { tension: 500 },
    from: {
        transform: `translate(0px, 0px) rotate(0deg) scale(0.9)`    
    },
    transform: `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg) scale(1.0)`
  });

  const handleMouseUp = () => {
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('mousemove', handleMouseMove);
    m.current = {x:-1,y:-1}
    pos.current = snapPoint.current
    
    setP(pos.current)
    onUp(pos.current)
  };

  const handleMouseDown = (e) => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    e.preventDefault();
  };
  const handleMouseMove = (e) => {
    let first = m.current.x == -1 ? true : false;
    let delta = {x:0,y:0};
    let force = {x:0,y:0};
    let mouse = {x:0,y:0};
    let mlength, mforce, torque;
    let outerRect = outerRef.current.getBoundingClientRect()
    m.current.x = e.clientX-outerRect.left; m.current.y = e.clientY-outerRect.top;
    if (!first) delta = subVec(m.current,mlast.current);
    else delta = {x:0,y:0};
    mlast.current = multVec(m.current,1)
    force = multVec(subVec(delta,v.current),weight);
    var l1 ={x:pos.current.x+outerRect.width/2, y:pos.current.y+outerRect.height/2}
    mouse = subVec(m.current,l1)
    if (force.x == 0) {
      mlength = mouse.x
      mforce = force.y
      torque = mforce * mlength
    } else if (force.y == 0) {
      mlength = mouse.y
      mforce = force.x
      torque = -mforce * mlength
    } else {
      var k = force.y / force.x;
      var kx = ((- k) * k * mouse.x + k * mouse.y) / ((- k) * k - 1);
      var ky = k * (kx - mouse.x) + mouse.y;
      mlength = Math.sqrt(kx * kx + ky * ky);
      mforce = Math.sqrt(force.x * force.x + force.y * force.y);
      if (force.x * ky > 0) torque = (-mforce) * mlength;
      else torque = mforce * mlength;
    }
    v.current = multVec(delta,1)
    l1 = addVec(l1,v.current)
    vr.current = vr.current - torque / inertia;
    mouse = subVec(m.current,l1)
    var cos = Math.cos(vr.current / 180 * Math.PI);
    var sin = Math.sin(vr.current / 180 * Math.PI);
    let add = {
      x: mouse.x*cos + mouse.y*sin - mouse.x,
      y: -mouse.x*sin + mouse.y*cos - mouse.y,
    }
    l1 = subVec(l1,add)
    let ang = pos.current.r;
    ang = ang - vr.current;
    v.current = multVec(v.current,1/breaking)
    vr.current = vr.current * 1/breaking
    pos.current = {
      x: l1.x-outerRect.width/2,
      y: l1.y-outerRect.height/2,
      r: ang
    }
    setP(pos.current)
    onMove(pos.current)
  };
  return (
    
    <Box
        // whileHover={{
        //   scale: 1.08
        // }}
        onMouseDown={handleMouseDown}
        // style={{
        //   x: p.x,
        //   y: p.y,
        //   rotate: p.r
        // }}
        style={style}
    >{prompt.t}
    </Box>

  )
}

export class Draggable extends React.Component {
  constructor(props) {
    super(props);
    this.m = {x:0,y:0};
    this.m0 = {x:0,y:0};
    // this.d = {x:0,y:0};
    this.v = {x:0,y:0};
    // this.f = {x:0,y:0};
    // this.loc = {x:0,y:0};
    this.weight = 1;
    this.inertia = 550;
    this.break = 1.15;
    // this.mlength = 0;
    // this.mforce = 0;
    // this.torque = 0;
    this.vr = 0;
    this.first = false;
    this.state = {
      x:0,
      y:0,
      r:0
    }
  }
  
  componentWillUnmount() {
    window.removeEventListener('mouseup', this.handleMouseUp);
  }
  handleMouseDown = (e) => {
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    this.m.x = e.nativeEvent.clientX; this.m.y = e.nativeEvent.clientY;
    this.m0 = {x:0,y:0};
    this.first = true;
  };
  handleMouseMove = (e) => {
    let delta, force, mouse, mlength, mforce, torque;
    this.m.x = e.clientX; this.m.y = e.clientY;
    if (!this.first) delta = subVec(this.m,this.m0);
    else delta = {x:0,y:0};
    this.first = false;
    this.m0 = multVec(this.m,1)
    force = multVec(subVec(delta,this.v),this.weight);
    var l1 ={x:this.state.x+100, y:this.state.y+100}
    mouse = subVec(this.m,l1)
    if (force.x == 0) {
      this.mlength = mouse.x
      this.mforce = force.y
      this.torque = this.mforce * this.mlength
    } else if (force.y == 0) {
      this.mlength = mouse.y
      this.mforce = force.x
      this.torque = -this.mforce * this.mlength
    } else {
      var k = force.y / force.x;
      var kx = ((- k) * k * mouse.x + k * mouse.y) / ((- k) * k - 1);
      var ky = k * (kx - mouse.x) + mouse.y;
      this.mlength = Math.sqrt(kx * kx + ky * ky);
      this.mforce = Math.sqrt(force.x * force.x + force.y * force.y);
      if (force.x * ky > 0) this.torque = (-this.mforce) * this.mlength;
      else this.torque = this.mforce * this.mlength;
    }
    this.v = multVec(delta,1)
    l1 = addVec(l1,this.v)
    
    this.vr = this.vr - this.torque / this.inertia;
    mouse = subVec(this.m,l1)
    var cos = Math.cos(this.vr / 180 * Math.PI);
    var sin = Math.sin(this.vr / 180 * Math.PI);
    let add = {
      x: mouse.x*cos + mouse.y*sin - mouse.x,
      y: -mouse.x*sin + mouse.y*cos - mouse.y,
    }
    l1 = subVec(l1,add)
    let ang = this.state.r;
    ang = ang - this.vr;
    this.v = multVec(this.v,1/this.break)
    this.vr = this.vr * 1/this.break
    this.setState({
      x: l1.x-100,
      y: l1.y-100,
      r: ang
    })
  };
  handleMouseUp = () => {
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    this.dragging = false;
    this.setState({
      x: 300,
      y: 300,
      r: 0
    })
  };
  render() {
    const { x, y, r } = this.state;

    return (
      <Box
        whileHover={{
          scale: 1.08
        }}
        onMouseDown={this.handleMouseDown}
        style={{
          // 'transform': `translate(${x}px, ${y}px) rotate(${r}deg)`
          x: x,
          y: y,
          rotate: r
        }}
      >
      </Box>
    );
  }



}

