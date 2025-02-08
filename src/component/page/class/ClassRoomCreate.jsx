import { useState, forwardRef } from 'react';
import styled from 'styled-components';
import TopBar from '../../ui/TopBar';
import Calendar from "../../img/classroom/calendar.png";
import Clock from "../../img/classroom/clock.png";
import DatePicker from "react-datepicker";
import "../../../style/react-datepicker.css";

export default function ClassRoomCreate() {
  const timeSlots = ['월', '화', '수', '목', '금', '토', '일'];
  const [isAssignmentPending, setIsAssignmentPending] = useState(false);
  const [isLecturePending, setIsLecturePending] = useState(false);

  const [form, setForm] = useState({
    coursename: '',
    instructor: '',
    startDate: null,
    durationWeeks: 1,
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

const handleDaySelect = (type, day) => {
  const key = type === 'lecture' ? 'lectureDays' : 'assignmentDays';
  const dayNumber = timeSlots.indexOf(day) + 1;
  setForm(prev => ({
    ...prev,
    [key]: prev[key].includes(dayNumber)
      ? prev[key].filter(d => d !== dayNumber)
      : [...prev[key], dayNumber]
  }));
 };
  
  const handleDifficultySelect = (difficulty) => {
    setForm(prev => ({ ...prev, difficulty }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', {
      title: form.coursename,
      instructorName: form.instructor,
      startDate: form.startDate?.toISOString().split('T')[0],
      durationWeeks: form.durationWeeks,
      lectureDay: form.lectureDays,
      lectureTime: form.lectureTime,
      assignmentDueDay: form.assignmentDays,
      assignmentDueTime: form.assignmentTime,
      difficultyLevel: form.difficulty
    });
  };

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <InputGroup onClick={onClick}> 
      <IconInput
        ref={ref}
        value={value}
        placeholder="커리큘럼 시작을 설정해주세요."
        readOnly
        style={{width: '439px'}}
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
                popperProps={{
                  placement: 'bottom-start',
                }}
              />
            </FormItem>

            <FormItem>
              <Label>
                커리큘럼 주차
                <Required>*</Required>
              </Label>
              <CuliculumGroup>
                <FormInput
                  type="number"
                  name="durationWeeks"
                  placeholder="숫자를 입력해주세요"
                  value={form.durationWeeks}
                  onChange={handleFormChange}
                  style={{width: '249px'}}
                />
                <Label style={{marginTop: '0px', marginLeft: '5px'}}>주</Label>
              </CuliculumGroup>
              <HelpText>1~12주차까지 입력가능해요.</HelpText>
            </FormItem>

            <FormItem>
              <Label>강의 시간</Label>
              <HalfGroup>
                <TimeGroup>
                <DayButtonGroup>
                  {timeSlots.map((day) => (
                    <DayButton 
                      key={day}
                      active={!isLecturePending && form.lectureDays.includes(timeSlots.indexOf(day) + 1)}
                      onClick={() => !isLecturePending && handleDaySelect('lecture', day)}
                    >
                      {day}
                    </DayButton>
                  ))}
                  </DayButtonGroup>
                  { !isLecturePending && <HelpText>복수 선택이 가능해요!</HelpText>}
                </TimeGroup>

                <TimeGroup>
                  <InputGroup>
                    <IconInput
                      type="time"
                      name='lectureTime'
                      placeholder="강의 시간을 설정해주세요."
                      style={{width: '239px'}}
                      value={form.lectureTime}
                      onChange={handleFormChange}
                      disabled={isLecturePending}
                    />
                    <CalendarIcon>
                      <img src={Clock} alt="시계 아이콘" style={{ width: '13px', height: '13px' }} />
                    </CalendarIcon>
                  </InputGroup>
                  { form.lectureTime && <HelpText>강의 시간이 설정되었어요!</HelpText> }
                </TimeGroup>

                <TimeGroup>
                  <RadioButton 
                    active={!isLecturePending}
                    onClick={() => {
                      setIsLecturePending(!isLecturePending)
                      if (!isLecturePending) {
                        setForm(prev => ({ ...prev, lectureDays: [], lectureTime: '' }));
                      }
                    }}
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
                      active={!isAssignmentPending && form.assignmentDays.includes(timeSlots.indexOf(day) + 1)}
  onClick={() => !isAssignmentPending && handleDaySelect('assignment', day)}
                    >
                      {day}
                    </DayButton>
                  ))}
                  </DayButtonGroup>
                  {!isAssignmentPending && <HelpText>복수 선택이 가능해요!</HelpText>}
                </TimeGroup>

                <TimeGroup>
                  <InputGroup>
                    <IconInput
                      type="time"
                      name='assignmentTime'
                      placeholder="과제 시간을 설정해주세요."
                      style={{width: '239px'}}
                      value={form.assignmentTime}
                      onChange={handleFormChange}
                      disabled={isAssignmentPending}
                    />
                    <CalendarIcon>
                      <img src={Clock} alt="시계" style={{ width: '13px', height: '13px' }} />
                    </CalendarIcon>
                  </InputGroup>
                  
                  { form.assignmentTime && <HelpText>과제 시간이 설정되었어요!</HelpText> }
                </TimeGroup> 

                <TimeGroup>
                  <RadioButton 
                    active={!isAssignmentPending}
                    onClick={() => {
                      setIsAssignmentPending(!isAssignmentPending)
                      if (!isAssignmentPending) {
                        setForm(prev => ({ ...prev, assignmentDays: [], assignmentTime: '' })); // 시간도 초기화
                      }
                    }}
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
              {form.difficulty === 'easy' && <HelpText>입문자를 위한 쉬운 개념 강의!</HelpText> }
              {form.difficulty === 'medium' && <HelpText>개념을 응용하고 실전 활용 능력을 키우는 강의!</HelpText> }
              {form.difficulty === 'hard' && <HelpText>실무에 적용할 수 있는 전문 강의!</HelpText> }
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
  cursor: pointer;
`;

const CreateButton = styled.button`
  border: none;
  cursor: pointer;
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
  min-height: 13px;
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
