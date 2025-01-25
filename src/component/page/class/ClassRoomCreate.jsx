import { useState, forwardRef } from 'react';
import styled from 'styled-components';
import TopBar from '../../ui/TopBar';
import Calendar from "../../img/classroom/calendar.png";
import Clock from "../../img/classroom/clock.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ClassRoomCreate() {
  const timeSlots = ['월', '화', '수', '목', '금', '토', '일'];

  const [form, setForm] = useState({
    name: '',
    instructor: '',
    couponCode: '',
    startDate: null,
    endDate: null,
    startTime: '',
    endTime: '',
    isPublic: true,
    difficulty: 'easy',
    selectedDays: {
      lecture: [],
      assignment: []
    }
  });

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
   
  const handleDateChange = (update) => {
    setDateRange(update);
    const [start, end] = update;
    setForm(prev => ({
      ...prev,
      startDate: start,
      endDate: end
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };


const handleDaySelect = (type, day) => {
  setForm(prev => ({
    ...prev,
    selectedDays: {
      ...prev.selectedDays,
      [type]: prev.selectedDays[type].includes(day)
        ? prev.selectedDays[type].filter(d => d !== day)
        : [...prev.selectedDays[type], day]
    }
  }));
 };

  const handlePublicToggle = (isPublic) => {
    setForm(prev => ({ ...prev, isPublic }));
  };
  
  const handleDifficultySelect = (difficulty) => {
    setForm(prev => ({ ...prev, difficulty }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', form);
   };

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <InputGroup onClick={onClick}>
      <ShortInput
        ref={ref}
        value={value}
        placeholder="커리큘럼 기간을 설정해주세요."
        readOnly
      />
      <CalendarIcon>
        <img src={Calendar} alt="캘린더 아이콘" />
      </CalendarIcon>
    </InputGroup>
  ));

  return (
    <>
      <TopBar />
      <Container>
        <Section>
          <Title>STEP 1. 강의실을 만들어볼까요?</Title>
          
          <FormGroup>
            <FormItem>
              <Label>
                강의명
                <Required>*</Required>
              </Label>
              <LongInput
                type="text"
                name="name"
                placeholder="30자 이내로 설정해주세요."
                value={form.name}
                onChange={handleInputChange}
              />
            </FormItem>

            <FormItem>
              <Label>
                강의자명
                <Required>*</Required>
              </Label>
              <LongInput
                type="text"
                name="instructor"
                placeholder="ex. 김원디"
                value={form.instructor}
                onChange={handleInputChange}
              />
            </FormItem>

            <FormItem>
              <Label>
                수강코드 설정
                <Required>*</Required>
              </Label>
              <InputGroup>
                <ShortInput
                  type="text"
                  name="couponCode"
                  placeholder="ex. 1TDAG"
                  value={form.couponCode}
                  onChange={handleInputChange}
                />
                <CheckButton>중복 확인</CheckButton>
              </InputGroup>
              <HelpText>대문자 영문 + 숫자 5자리로 설정해주세요.</HelpText>
            </FormItem>
          </FormGroup>
        </Section>

        <Section>
          <Title>STEP 2. 수강생이 얼마나 강의를 들어야 하나요?</Title>
          
          <FormGroup>
            <FormItem>
              <Label>커리큘럼 기간</Label>
              <DatePicker
                selectsRange={true}
                startDate={form.startDate}
                endDate={form.endDate}
                onChange={handleDateChange}
                customInput={<CustomInput />}
                dateFormat="yyyy.MM.dd"
              />
              <HelpText>6주 커리큘럼으로 설정되었어요!</HelpText>
            </FormItem>

            <FormItem>
              <Label>강의 시간</Label>
              <HalfGroup>
                <TimeGroup>
                <DayButtonGroup>
                  {timeSlots.map((day) => (
                    <DayButton 
                      key={day}
                      active={form.selectedDays.lecture.includes(day)}
                      onClick={() => handleDaySelect('lecture', day)}
                    >
                      {day}
                    </DayButton>
                  ))}
                  </DayButtonGroup>
                  <HelpText>복수 선택이 가능해요!</HelpText>
                </TimeGroup>

                <TimeGroup>
                  <InputGroup>
                    <ShortInput
                      type="text"
                      placeholder="강의 시간을 설정해주세요."
                      style={{width: '65%'}}
                    />
                    <CalendarIcon>
                      <img src={Clock} alt="시계 아이콘" style={{ width: '13px', height: '13px' }} />
                    </CalendarIcon>
                  </InputGroup>
                  <HelpText>강의 시간이 설정되었어요!</HelpText>
                </TimeGroup>
              </HalfGroup>
            </FormItem>

            <FormItem>
              <Label>과제 시간</Label>
              <HalfGroup>
                <TimeGroup>
                <DayButtonGroup>
                  {timeSlots.map((day) => (
                    <DayButton 
                      key={day}
                      active={form.selectedDays.assignment.includes(day)}
                      onClick={() => handleDaySelect('assignment', day)}
                    >
                      {day}
                    </DayButton>
                  ))}
                  </DayButtonGroup>
                  <HelpText>복수 선택이 가능해요!</HelpText>
                </TimeGroup>
                <TimeGroup>
                  <InputGroup>
                    <ShortInput
                      type="text"
                      placeholder="과제 시간을 설정해주세요."
                      style={{width: '65%'}}
                    />
                    <CalendarIcon>
                      <img src={Clock} alt="시계 아이콘" style={{ width: '13px', height: '13px' }} />
                    </CalendarIcon>
                  </InputGroup>
                  <HelpText>강의 시간이 설정되었어요!</HelpText>
                </TimeGroup>
              </HalfGroup>
            </FormItem>
          </FormGroup>
        </Section>

        <Section>
          <Title>STEP 3. 수강생에게 강좌를 어떻게 공개하실 건가요?</Title>
          <FormGroup>
            <FormItem>
              <Label>강좌 공개 여부</Label>
              <ButtonGroup>
                <RadioButton 
                  active={form.isPublic} 
                  onClick={() => handlePublicToggle(true)}
                >
                  공개
                </RadioButton>
                <RadioButton 
                  active={!form.isPublic}
                  onClick={() => handlePublicToggle(false)}
                >
                  비공개
                </RadioButton>
              </ButtonGroup>
            </FormItem>

            <FormItem>
              <Label>수업 난이도</Label>
              <ButtonGroup>
                {['easy', 'medium', 'hard'].map((level) => (
                  <LevelButton
                    key={level}
                    active={form.difficulty === level}
                    onClick={() => handleDifficultySelect(level)}
                  >
                    {level === 'easy' ? '쉬움' : level === 'medium' ? '보통' : '어려움'}
                  </LevelButton>
                ))}
              </ButtonGroup>
              <HelpText>초보자도 강의를 듣고 수업 내용을 따라잡을 수 있어요!</HelpText>
            </FormItem>
          </FormGroup>
        </Section>
        <CreateButton onClick={handleSubmit}>강의실 만들기</CreateButton>
      </Container>
    </>
  );
}

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const RadioButton = styled.button`
  padding: 6px 32px;
  border: none;
  border-radius: 20px;
  font-size: 15px;
  background-color: ${props => props.active ? '#FF4747' : '#F6F6F6'};
  color: ${props => props.active ? '#FFFFFF' : '#909090'};
`;

const LevelButton = styled(RadioButton)`
  padding: 6px 24px;
  border: none;
`;

const CreateButton = styled.button`
  border: none;
  width: 100%;
  padding: 10px 0;
  background-color: #FF4747;
  color: white;
  font-size: 17px;
  font-weight: 500;
  border-radius: 10px;
  margin-top: 20px;
`;

const Container = styled.div`
  margin: 31px;
  padding: 24px 30px;
  background-color: white;
  border-radius: 20px;
`;

const Section = styled.div`
  width: 100%;
  margin-bottom: 44px;
  border-bottom: 2px solid #C3C3C3;
`;

const Title = styled.div`
  font-size: 21px;
  font-weight: 700;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormItem = styled.div`
  margin-bottom: 30px;
  width: 100%;
`;

const Label = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  color: #000000;
  font-size: 17px;
  font-weight: 500;
`;

const Required = styled.span`
  color: #FF4747;
  font-weight: 800;
`;

const LongInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  font-size: 13px;
  padding: 0.5rem;
  border: 2px solid #C3C3C3;
  border-radius: 10px;
`;

const ShortInput = styled.input`
  width: 40%;
  box-sizing: border-box;
  font-size: 13px;
  padding: 8px 35px 8px 12px;
  border: 2px solid #C3C3C3;
  border-radius: 10px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  position: relative;
`;

const CheckButton = styled.button`
  padding: 5px 21px;
  background-color: #FF4747;
  color: white;
  font-size: 17px;
  font-weight: 500;
  border-radius: 10px;
  white-space: nowrap;
`;

const HelpText = styled.p`
  color: #FF4747;
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
  margin-left: 10px;
`;

const DayButtonGroup = styled.div`
  display: flex;
  gap: 5px;
`;

const DayButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${props => props.active ? '#FF4747' : '#D9D9D9'};
  color: ${props => props.active ? '#FFFFFF' : '#909090'};
`;

const CalendarIcon = styled.span`
  top: 50%;
  transform: translateY(-50%);
  transform: translateX(-250%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimeGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const HalfGroup = styled.div`
  display: flex;
  flex-direction: row;
`;
