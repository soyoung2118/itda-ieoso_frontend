import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Clock from "../img/classroom/clock.png";
import { debounce } from 'lodash';

const BUTTON_HEIGHT = 40;
const MERIDIEM_ITEMS = ['오전', '오후'];
const HOUR_ITEMS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTE_ITEMS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const CustomTimePicker = ({ value = new Date(), onChange, width = 239 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState(value);
    const scrollViewsRef = useRef([null, null, null]);
    const [currentMeridiem, setCurrentMeridiem] = useState(
      value.getHours() >= 12 ? '오후' : '오전'
    );

    const formatTimeString = (date) => {
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const meridiem = hours >= 12 ? '오후' : '오전';
      const hour12 = String(hours % 12 || 12).padStart(2, '0');
      return `${meridiem} ${hour12}:${minutes}`;
    };

    const [inputTime, setInputTime] = useState(formatTimeString(value));

    useEffect(() => {
      setSelectedTime(value);
      setCurrentMeridiem(value.getHours() >= 12 ? '오후' : '오전');
      setInputTime(formatTimeString(value));
    }, [value]);

    useEffect(() => {
      setInputTime(formatTimeString(selectedTime));
    }, [selectedTime]);

    useEffect(() => {
      if (!isOpen) return;
  
      const initializeScrollPositions = () => {
          timeColumns.forEach(({ key }, index) => {
              if (!scrollViewsRef.current[index]) return;
  
              const hours = selectedTime.getHours();
              const minutes = selectedTime.getMinutes();
              const hour = String((hours % 12) || 12).padStart(2, '0');
  
              let scrollPosition = 0;
              if (key === 'meridiem') {
                  scrollPosition = MERIDIEM_ITEMS.indexOf(currentMeridiem) * BUTTON_HEIGHT;
              } else if (key === 'hour') {
                  scrollPosition = HOUR_ITEMS.findIndex(h => h === hour) * BUTTON_HEIGHT;
              } else {
                  scrollPosition = minutes * BUTTON_HEIGHT;
              }
  
              scrollViewsRef.current[index].scrollTo({
                  top: scrollPosition,
                  behavior: 'instant',
              });
          });
      };
    
        requestAnimationFrame(initializeScrollPositions);
    }, [isOpen, selectedTime, currentMeridiem]);
  
    const handleScrollEnd = debounce((key, index) => {
      if (!scrollViewsRef.current[index]) return;
  
      const scrollView = scrollViewsRef.current[index];
      const scrollTop = scrollView.scrollTop;
      const itemIndex = Math.min(
        Math.max(
          Math.round(scrollTop / BUTTON_HEIGHT),
          0
        ),
        key === 'meridiem' ? 1 : (key === 'hour' ? 11 : 59)
      );

      requestAnimationFrame(() => {
        scrollView.scrollTo({
          top: itemIndex * BUTTON_HEIGHT,
          behavior: 'smooth'
        });
      });
      
      const newDate = new Date(selectedTime);
      
      if (key === 'meridiem') {
        const selectedMeridiem = MERIDIEM_ITEMS[itemIndex];
        const currentHours = newDate.getHours();
  
        setCurrentMeridiem(selectedMeridiem);
  
        if (selectedMeridiem === '오후' && currentHours < 12) {
          newDate.setHours(currentHours === 0 ? 12 : currentHours + 12);
        } else if (selectedMeridiem === '오전' && currentHours >= 12) {
          newDate.setHours(currentHours === 12 ? 0 : currentHours - 12);
        }
      } else if (key === 'hour') {
        const newHour = parseInt(HOUR_ITEMS[itemIndex]);
        const isPM = currentMeridiem === '오후';
        
        if (isPM) {
          newDate.setHours(newHour === 12 ? 12 : newHour + 12);
        } else {
          newDate.setHours(newHour === 12 ? 0 : newHour);
        }
      } else if (key === 'minute') {
        const newMinute = parseInt(MINUTE_ITEMS[itemIndex]);
        newDate.setMinutes(newMinute);
      }
  
      setSelectedTime(newDate);
      onChange(newDate);
    }, 50);
  
    const timeColumns = [
      { key: 'meridiem', items: MERIDIEM_ITEMS },
      { key: 'hour', items: HOUR_ITEMS },
      { key: 'minute', items: MINUTE_ITEMS }
    ];
  
    return (
      <Container width={width}>
        <InputDisplay onClick={() => setIsOpen(!isOpen)}>
          <TimeText>{inputTime}</TimeText>
          <ClockIcon>
            <img src={Clock} style={{width: 18}} alt="캘린더" />
          </ClockIcon>
        </InputDisplay>
  
        {isOpen && (
          <DropdownContainer>
            <TimePickerContainer>
              {timeColumns.map(({ key, items }, index) => (
                <Column key={key}>
                  <ScrollView 
                      ref={(el) => {
                        if (el) {
                            scrollViewsRef.current[index] = el;
                        }
                      }}
                        onScroll={() => handleScrollEnd(key, index)}
                        >
                        <Padding />
                        {items.map((item) => (
                            <TimeButton key={item}>
                            {item}
                            </TimeButton>
                        ))}
                        <Padding />
                        </ScrollView>
                </Column>
              ))}
              <Selection />
            </TimePickerContainer>
          </DropdownContainer>
        )}
      </Container>
    );
  };

const Container = styled.div`
  position: relative;
  width: ${props => props.width}px;
`;

const InputDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 2px solid #C3C3C3;
  border-radius: 10px;
  background: white;
  cursor: pointer;
`;

const TimeText = styled.span`
  font-size: 13px;
  color: #333;
`;

const Padding = styled.div`
  height: ${BUTTON_HEIGHT}px;
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 50;
`;

const TimePickerContainer = styled.div`
  display: flex;
  height: ${BUTTON_HEIGHT * 3}px;
  border: 2px solid #C3C3C3;
  border-radius: 10px;
  position: relative;
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const Column = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const ScrollView = styled.div`
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  
  & > * {
    scroll-snap-align: center;
  }
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TimeButton = styled.div`
  height: ${BUTTON_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  
  &:hover {
    background: rgba(0,0,0,0.05);
  }
`;

const Selection = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: ${BUTTON_HEIGHT}px;
  transform: translateY(-50%);
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background: rgba(0,0,0,0.02);
  pointer-events: none;
`;

const Separator = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
  color: #666;
`;

const ClockIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default CustomTimePicker;