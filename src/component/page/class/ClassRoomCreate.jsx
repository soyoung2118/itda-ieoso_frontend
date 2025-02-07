import { useState, forwardRef } from 'react';
import styled from 'styled-components';
import TopBar from '../../ui/TopBar';
import Calendar from "../../img/classroom/calendar.png";
import Clock from "../../img/classroom/clock.png";
import DatePicker from "react-datepicker";
import "../../../style/react-datepicker.css";

export default function ClassRoomCreate() {
  const timeSlots = ['월', '화', '수', '목', '금', '토', '일'];

  const [form, setForm] = useState({
    coursename: '',
    instructor: '',
    startDate: null,
    culiculumWeek: '',
    lectureDays: [],
    lectureTime: '',
    assignmentDays: [],
    assignmentTime: '',
    difficulty: 'easy',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
   
  const handleDateChange = (e) => {
    setDateRange(update);
    const [start] = e;
    setForm(prev => ({
      ...prev,
      startDate: start,
    }));
  };

const handleDaySelect = (type, day) => {
  const key = type === 'lecture' ? 'lectureDays' : 'assignmentDays';
  setForm(prev => ({
    ...prev,
    [key]: prev[key].includes(day)
      ? prev[key].filter(d => d !== day)
      : [...prev[key], day]
  }));
 };
  
  const handleDifficultySelect = (difficulty) => {
    setForm(prev => ({ ...prev, difficulty }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', form);
   };

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <InputGroup onClick={onClick}> 
      <IconInput
        ref={ref}
        value={value}
        placeholder="커리큘럼 시작을 설정해주세요."
        readOnly
        style={{width: '539px'}}
      />
      <CalendarIcon>
        <img src={Calendar} style={{width: 16}} alt="캘린더" />
      </CalendarIcon>
    </InputGroup>
  ));

  return (
    <>
      <TopBar />
      <Container>
        <Section>
          <Title style={{marginTop: '6px'}}>STEP 1. 강의실을 만들어볼까요?</Title>
          
          <FormGroup>
            <FormItem>
              <Label>
                강의명
                <Required>*</Required>
              </Label>
              <FormInput
                type="text"
                name="coursename"
                placeholder="30자 이내로 설정해주세요."
                value={form.coursename}
                onChange={handleFormChange}
                style={{width: '100%'}}
              />
            </FormItem>

            <FormItem>
              <Label>
                강의자명
                <Required>*</Required>
              </Label>
              <FormInput
                type="text"
                name="instructor"
                placeholder="ex. 김잇다"
                value={form.instructor}
                onChange={handleFormChange}
                style={{width: '265px'}}
              />
            </FormItem>
          </FormGroup>
        </Section>

        <Section>
          <Title>STEP 2. 수강생이 얼마나 강의를 들어야 하나요?</Title>
          
          <FormGroup>
            <FormItem>
              <Label>
                커리큘럼 시작
                <Required>*</Required>
              </Label>
              <DatePicker
                selected={form.startDate}
                onChange={(date) => {
                  setForm(prev => ({
                    ...prev,
                    startDate: date
                  }));
                }}
                customInput={<CustomInput />}
                dateFormat="yyyy-MM-dd"
              />
              {/* <ShortInput
                type="date"
                name="startDate"
                placeholder="ex. 김잇다"
                value={form.startDate}
                onChange={handleDateChange}
              /> */}
            </FormItem>

            <FormItem>
              <Label>
                커리큘럼 주차
                <Required>*</Required>
              </Label>
              <CuliculumGroup>
                <FormInput
                  type="number"
                  name="culiculumWeek"
                  placeholder="숫자를 입력해주세요"
                  value={form.culiculumWeek}
                  onChange={handleFormChange}
                  style={{width: '249px'}}
                />
                <Label style={{marginTop: '0px', marginLeft: '5px'}}>주</Label>
              </CuliculumGroup>
            </FormItem>

            <FormItem>
              <Label>강의 시간</Label>
              <HalfGroup>
                <TimeGroup>
                <DayButtonGroup>
                  {timeSlots.map((day) => (
                    <DayButton 
                      key={day}
                      active={form.lectureDays.includes(day)}
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
                    <IconInput
                      type="time"
                      name='lectureTime'
                      placeholder="강의 시간을 설정해주세요."
                      style={{width: '239px'}}
                      onChange={handleFormChange}
                    />
                    <CalendarIcon>
                      <img src={Clock} alt="시계 아이콘" style={{ width: '13px', height: '13px' }} />
                    </CalendarIcon>
                  </InputGroup>
                  { form.lectureTime && <HelpText>강의 시간이 설정되었어요!</HelpText> }
                </TimeGroup>

                <TimeGroup>
                  <RadioButton 
                    //active={form.is} 
                  >
                    정해지지 않았어요
                  </RadioButton>
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
                      active={form.assignmentDays.includes(day)}
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
                    <IconInput
                      type="time"
                      name='assignmentTime'
                      placeholder="과제 시간을 설정해주세요."
                      style={{width: '239px'}}
                      onChange={handleFormChange}
                    />
                    <CalendarIcon>
                      <img src={Clock} alt="시계" style={{ width: '13px', height: '13px' }} />
                    </CalendarIcon>
                  </InputGroup>
                  
                  { form.assignmentTime && <HelpText> 과제 시간이 설정되었어요!</HelpText> }
                </TimeGroup> 

                <TimeGroup>
                  <RadioButton 
                    active={true} 
                  >
                    정해지지 않았어요
                  </RadioButton>
                </TimeGroup>
              </HalfGroup>
            </FormItem>
          </FormGroup>
        </Section>

        <Section style={{borderBottom: 'none'}}>
          <Title>STEP 3. 수강생에게 강좌를 어떻게 공개하실 건가요?</Title>
          <FormGroup>
            {/* <FormItem>
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
            </FormItem> */}

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
  padding: 8px 20px;
  border: none;
  border-radius: 10px;
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
`;

const Container = styled.div`
  margin: 31px;
  padding: 24px 30px;
  background-color: white;
  border-radius: 20px;
`;

const Section = styled.div`
  width: 100%;
  padding-bottom: 30px;
  border-bottom: 2px solid #C3C3C3;
`;

const Title = styled.div`
  font-size: 21px;
  font-weight: 700;
  margin-top: 30px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormItem = styled.div`
  margin-bottom: 15px;
  width: 100%;
`;

const Label = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  color: #000000;
  font-size: 17px;
  font-weight: 500;
  margin-top: 20px;
`;

const Required = styled.span`
  color: #FF4747;
  font-weight: 800;
`;

const FormInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  font-size: 13px;
  padding: 8px 12px;
  border: 2px solid #C3C3C3;
  border-radius: 10px;
`;

const IconInput = styled.input`
  box-sizing: border-box;
  font-size: 13px;
  padding: 8px 32px 8px 12px;
  border: 2px solid #C3C3C3;
  border-radius: 10px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const HelpText = styled.div`
  height: 13px;
  color: #FF4747;
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
  margin-left: 10px;
`;

const DayButtonGroup = styled.div`
  display: flex;
  gap: 5px;
  margin-right: 10px;
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
  display: flex;
  flex-direction: column;
`;

const CuliculumGroup = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
`;

const HalfGroup = styled.div`
  display: flex;
  flex-direction: row;
`;
