import React, { useReducer, useEffect } from "react";

let reducer = (store, newStore) => {
    return { ...store, ...newStore };
};

const prompts = [
    {t:'Follow the direction of the smell', r:1},
    {t:'Walk against the wind', r:1},
    {t:'Towards the next pretzel bakery', r:1},
    {t:'Halfway home', r:1},
    {t:'Follow a group', r:1},
    {t:'Walk towards a tree', r:1},
];

const initialState = {
    mode: 0,
    currentDrift: null,
    drifts: [],
    nextPrompts: prompts.slice(0,2)
};

const StoreContext = React.createContext();

function StoreProvider(props) {
  const [store, setStore] = useReducer(reducer, initialState);
  return (
      <StoreContext.Provider value={{ store, setStore }}>
          {props.children}
      </StoreContext.Provider>
  );
}

export { StoreContext, StoreProvider };
