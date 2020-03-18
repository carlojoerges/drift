import React, { useReducer, useEffect } from "react";
import { observer, useLocalStore } from 'mobx-react'
import { toJS, reaction } from 'mobx'
import { driftsRef } from './firebase';

let prompts = [
    {t:'Follow the direction of the smell', r:Math.random()},
    {t:'Walk against the wind', r:Math.random()},
    {t:'Towards the next pretzel bakery', r:Math.random()},
    {t:'Halfway home', r:Math.random()},
    {t:'Follow a group', r:Math.random()},
    {t:'Walk towards a tree', r:Math.random()},
];
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
      get currentDrift() {
          return store.drifts.length ? store.drifts[store.drifts.length-1] : null
      },
      get availablePrompts() {
          if (store.currentDrift) {
            let n = 0;
            store.currentDrift.prompts.map((p)=>{
                if (!p.add) n++;
            })
            return n;
          } else return 2;
      },
      drifts: [],
      addPrompt(p) {
        if (store.currentDrift) {
            p.id = store.currentDrift.prompts.length
            store.currentDrift.prompts.push(p)
        }
      },
      startDrift() {
          store.mode = 1;
          store.drifts.push({
              prompts: []
          })
          store.addPrompt(pickRandomPrompt())
          store.addPrompt(pickRandomPrompt())
      },
      saveDrift() {
        if (store.currentDrift) {
            let n = {
                prompts:[],
                id: store.currentDrift.id
            };
            store.currentDrift.prompts.map((p)=>{
                if (p.add) {
                    let ps = toJS(p)
                    console.log(ps)
                    ps.added = new Date();
                    n.prompts.push(ps);
                }
            })
            console.log(n)
            if (n.prompts.length) {
                console.log(n.id)
                console.log(!n.id)
                if (!n.id) n.id = store.currentDrift.id = driftsRef.push().key;
                driftsRef.update({
                    [n.id]: {prompts:n.prompts}
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
    console.log(snapshot.val());
  });

  store.tick();

  const addPrompts = () => {
    if (store.availablePrompts<2) {
        store.addPrompt(pickRandomPrompt())
    }
  }

  reaction(() => `${store.availablePrompts}`, addPrompts)

  return (
      <StoreContext.Provider value={store}>
          {props.children}
      </StoreContext.Provider>
  );
}

export { StoreContext, StoreProvider };
