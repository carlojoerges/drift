import React, { useReducer, useEffect } from "react";
import { observer, useLocalStore } from 'mobx-react'
import { toJS, reaction } from 'mobx'
import { driftsRef } from './firebase';
import moment from 'moment-mini';
import {Prompts} from './Prompts'
import {personalStory, story} from './Story';


// let prompts = [
//     {t:'Follow the direction of the smell', r:Math.random()},
//     {t:'Walk against the wind', r:Math.random()},
//     {t:'Towards the next pretzel bakery', r:Math.random()},
//     {t:'Halfway home', r:Math.random()},
//     {t:'Follow a group', r:Math.random()},
//     {t:'Walk towards a tree', r:Math.random()},
// ];

let prompts = Prompts.map((p) => ({...p, ...{r:Math.random()}}))

const sortPrompts = () => {
    prompts.sort((a,b) => {
        return a.r - b.r;
    })
}
const pickRandomPrompt = () => {
    sortPrompts()
    var i = Math.floor(Math.random()*prompts.length/2);
    prompts[i].r++;
    return prompts[i];
}


const StoreContext = React.createContext();

function StoreProvider(props) {
  const store = useLocalStore(() => ({
      mode: 0,
      started: 0,
      get currentDrift() {
          return store.drifts.length ? store.drifts[store.drifts.length-1] : null
      },
      get availablePrompts() {
          if (store.currentDrift) {
            let n = 0;
            store.currentDrift.prompts.map((p)=>{
                if (p.add == undefined && !p.added) n++;
            })
            return n;
          } else return 2;
      },
      get currentDriftStory() {
        if (store.currentDrift) {
            let ps = [];
            store.currentDrift.prompts.map((p)=>{
                if (p.add) ps.push({c:store.currentDrift.c || "", d:moment(p.added), p:p.p, t:p.t})
            })
            console.log(ps)
            return story(ps)
        } else return null;
      },
      get currentPersonalStory() {
        if (store.currentDrift) {
            let ps = [];
            store.currentDrift.prompts.map((p)=>{
                if (p.add) ps.push({c:store.currentDrift.c || "", d:moment(p.added), p:p.p, t:p.t})
            })
            console.log(ps)
            return personalStory(ps)
        } else return null;
      },
      story: null,
      drifts: [],
      addPrompt(p) {
        if (store.currentDrift) {
            p.id = store.currentDrift.prompts.length
            store.currentDrift.prompts.push(p)
        }
      },
      startDrift() {
          store.started = 0;
          store.mode = 0;
          store.drifts.push({
              prompts: []
          })
      },
      startWalking(city) {
        if (store.currentDrift) {
            store.currentDrift.c = city;
            store.mode = 3;
        }
      },
      pickCity() {
        store.mode = 1;
      },
      returnHome() {
        store.mode = 0;
      },
      saveDrift() {
        if (store.currentDrift) {
            let n = {
                prompts:[],
                c: store.currentDrift.c,
                id: store.currentDrift.id
            };
            store.currentDrift.prompts.map((p)=>{
                if (p.add) {
                    let ps = toJS(p)
                    delete ps.add
                    delete ps.id
                    delete ps.r

                    // ps.added = new Date();
                    n.prompts.push(ps);
                }
            })
            console.log(n)
            if (n.prompts.length) {
                if (!n.id) n.id = store.currentDrift.id = driftsRef.push().key;
                driftsRef.update({
                    [n.id]: {prompts:n.prompts, c:n.c}
                });
            }
        }
      },
      updateFbDrift(id,data) {
        driftsRef.update({[id]:data})
      },
      tick() {
          store.t = new Date().getTime()
          setTimeout(store.tick, 1000)
      }
  }))
  window.store = store;

  driftsRef.on('value', (snapshot) => {
    const snap = snapshot.val();
    let ps = [];
    if (snap) Object.entries(snap).forEach(([key, value]) => {
        value.prompts.forEach((p)=>{
            ps.push({c:value.c, d:moment(p.added), p:p.p, t:p.t})
        })
    });
    store.story = story(ps);
  });

  store.tick();

  const addPrompts = () => {
    if (store.availablePrompts<2) {
        store.addPrompt(pickRandomPrompt())
    }
  }
  
  reaction(() => `${store.availablePrompts}`, addPrompts)

  store.drifts.push({
              prompts: []
          })


  return (
      <StoreContext.Provider value={store}>
          {props.children}
      </StoreContext.Provider>
  );
}


export { StoreContext, StoreProvider };
