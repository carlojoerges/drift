import React, {useState, useRef, useContext} from 'react';
import { observer } from 'mobx-react'
import { StoreContext, StoreProvider } from './Store'
import { ScreenWrap,BottomBar,TextButton,CloseButton, PinIcon, SubmitArrow } from './Styles'
import styled from "styled-components";
import Downshift from 'downshift'

const baseItems = [
    {value: 'New York'},
    {value: 'San Francisco'},
    {value: 'Berlin'},
    {value: 'Zurich'},
    {value: 'Tokyo'},
    {value: 'Guayaquil'},
    {value: 'Hamburg'},
    {value: 'Paris'},
    {value: 'London'},
  ];

export const Title = styled.h1`
  font-family: 'Bodoni';
  font-weight: 100;
  font-size: 10vw;
  line-height: 100%;
  color: white;
  padding: 0 12vw;
  margin: 0 0 24px 0;
`

export const SubTitle = styled.h5`
  font-family: 'Bodoni';
  font-weight: 400;
  font-size: 2vw;
  color: white;
  padding: 0 12vw;
  margin: 0 0 24px 0;
`

export const MetaTitle = styled.h6`
  text-transform: uppercase;
  font-family: 'Bodoni';
  font-weight: 400;
  letter-spacing: 25%;
  font-size: 12px;
  color: #F5F3E9;
  padding: 16px 12vw;
  margin: 0;
  opacity: .5;
`


export const CityInput = styled.div`
  border-top: 1px solid #1F231E;
  border-bottom: 1px solid #1F231E;
  display: flex;
  align-items: center;
  padding: 28px 12vw;
  margin: 0 0 24px 0;
`
const CityInputField = styled.input`
  flex-grow: 1;
  background: transparent;
  border: 0;
  outline: 0;
  margin-left: 12px;
  color: white;
  font-family: 'Bodoni';
  font-size: 2vw;
`

const Suggestions = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`
const Suggestion = styled.li`
  font-family: 'Bodoni';
  font-size: 18px;
  color: white;
  padding: 16px 12vw;
  &[aria-selected="true"] {
      background: #1F231E !important;
  }
`

const Menu = observer(() => {
  const store = useContext(StoreContext)
  return (
  <BottomBar>
    <TextButton onTap={()=> { store.startDrift() }} stretch>Cancel</TextButton>
  
  </BottomBar>
  )
})

export const City = () => {
    const store = useContext(StoreContext)
    const [items,setItems] = useState(baseItems)
    const searchInput = useRef(null);

    React.useEffect(()=>{
      // current property is refered to input element
      searchInput.current.focus();
   },[])
 

    return (
      <ScreenWrap>
        <Menu/>
        <Title>Where are you walking?</Title>
        <SubTitle>This will be used anonymously</SubTitle>
        <Downshift
            onChange={selection => {
                if(selection.value) {
                  console.log(selection.value)
                  store.startWalking(selection.value)
                }
            }}
            itemToString={item => (item ? item.value : '')}
            defaultIsOpen={true}

        >
            {({
                getInputProps,setHighlightedIndex,getItemProps,getLabelProps,getMenuProps,isOpen,inputValue,highlightedIndex,selectedItem,
            }) => (
            <div>
                <CityInput>
                    <PinIcon/>
                    <CityInputField placeholder="Enter a place" ref={searchInput}
                    {...getInputProps({
                      onKeyUp: event => {
                        if (inputValue.trim().length > 0) {
                          let i = inputValue.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
                          let found = false;
                          baseItems.map((bi) => {
                            found = found || bi.value == i;
                          })
                          if (found) setItems(baseItems); else setItems([{value:i},...baseItems]);
                          setHighlightedIndex(0)
                        } else {
                          setItems(baseItems)
                        }
                      },
                    })} />
                    <SubmitArrow/>
                </CityInput>
                <Suggestions {...getMenuProps()}>
                {isOpen
                    ? items
                        .filter(item => !inputValue || item.value.toLowerCase().includes(inputValue.toLowerCase()))
                        .map((item, index) => (
                        <Suggestion
                            {...getItemProps({
                            key: item.value,
                            index,
                            item,
                            style: {
                                backgroundColor:
                                highlightedIndex === index ? 'lightgray' : null,
                                fontWeight: selectedItem === item ? 'bold' : 'normal',
                            },
                            })}
                        >
                            {item.value}
                        </Suggestion>
                        ))
                    : null}
                </Suggestions>
            </div>
            )}
        </Downshift>
      </ScreenWrap>
    )
  }