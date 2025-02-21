import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import AdminTopBar from '../../ui/class/AdminTopBar';
import api from "../../api/api";
import { UsersContext } from '../../contexts/usersContext';

export default function Setting() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user } = useContext(UsersContext);
  const timeSlots = ['월', '화', '수', '목', '금', '토', '일'];
  const [isAssignmentPending, setIsAssignmentPending] = useState(false);
  const [isLecturePending, setIsLecturePending] = useState(false);

  const [showDifficultyChange, setShowDifficultyChange] = useState('');

  const [form, setForm] = useState({
    coursename: '',
    instructor: '',
    entrycode: '',
    startDate: null,
    durationWeeks: 1, 
    lectureDays: [],
    lectureTime: '',
    assignmentDays: [],
    assignmentTime: '',
    difficulty: 'easy',
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseResponse = await api.get(`/courses/${courseId}`);
        if(!courseResponse.data.success) {
          console.log("강의 정보 불러오기 실패");
        } else{
          const courseData = courseResponse.data.data;
          console.log(courseData);
          
          setForm({
            coursename: courseData.courseTitle,
            instructor: courseData.instructorName,
            entrycode: courseData.entryCode,
            startDate: courseData.startDate,
            durationWeeks: courseData.durationWeeks,
            lectureDays: courseData.lectureDay ? courseData.lectureDay.split(',').map(Number) : [],
            lectureTime: courseData.lectureTime?.slice(0, -3),
            assignmentDays: courseData.assignmentDueDay ? courseData.assignmentDueDay.split(',').map(Number) : [],
            assignmentTime: courseData.assignmentDueTime?.slice(0, -3),
            difficulty: courseData.difficultyLevel?.toLowerCase()
          });

          setIsAssignmentPending(!courseData.assignmentDueDay || courseData.assignmentDueTime === '');
          setIsLecturePending(!courseData.lectureDay || courseData.lectureTime === '');
        }
      } catch (error) {
        console.error('Failed to fetch course data:', error);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    .then(() => {
      console.log('텍스트가 복사되었습니다!');
    })
    .catch(err => {
      console.error('복사 중 오류가 발생했습니다:', err);
    });
  };

  const formatTimeWithMeridiem = (timeString) => {
    if (!timeString) return '';
  
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);
    
    if (hourNum === 0) return '오전 12:' + minutes;
    if (hourNum === 12) return '오후 12:' + minutes;
    
    if (hourNum < 12) {
      return `오전 ${String(hourNum).padStart(2, '0')}:${minutes}`;
    } else {
      return `오후 ${String(hourNum - 12).padStart(2, '0')}:${minutes}`;
    }
  };

  const handleDifficultySelect = (newLevel) => {
    if (form.difficulty !== newLevel) {
        const difficultyText = {
            easy: '쉬움',
            medium: '보통',
            hard: '어려움'
        };
        setShowDifficultyChange(`난이도를 ${difficultyText[newLevel]}으로 변경했어요!`);
    }
    setForm(prev => ({ ...prev, difficulty: newLevel }));
    };

  const handleSubmit = async () => {
    try{
      if (!user) {
        console.log('사용자 정보가 없습니다');
        return;
      }

      const settingData = {
        title: form.coursename,
        instructorName: form.instructor,
        startDate: form.startDate,
        durationWeeks: Number(form.durationWeeks),
        lectureDay: form.lectureDays,
        lectureTime: form.lectureTime + ':00',
        assignmentDueDay: form.assignmentDays,
        assignmentDueTime: form.assignmentTime + ':00',
        difficultyLevel: form.difficulty.toUpperCase()
      };

      console.log(settingData);

      const settingResponse = await api.put(`/courses/${courseId}/${user.userId}/setting`, 
        settingData
      );

      if (settingResponse.data.success) {
        console.log(settingResponse.data);
        navigate(`/class/${courseId}/overview/info`);
        window.location.reload()
      } else {
        throw new Error('강의실 내용 수정에 실패했습니다');
      }
    } catch (error) {
      console.error('Failed to update course setting:', error);
    }

    //navigate('/curriculum');
  };

  return (
    <>
      <AdminTopBar />
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
                value={form.coursename}
                onChange={handleFormChange}
                style={{width: '100%'}}
                autoComplete='off'
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
                style={{width: '165px'}}
                autoComplete='off'
              />
            </FormItem>

            <FormItem>
              <Label>
                강의코드
              </Label>
              <HalfGroup>
                <DisableInput
                    value={form.entrycode}
                    disabled
                    style={{width: '165px', marginRight: '10px', color: '#FF4747'}}
                />
                <RadioButton 
                    active={true}
                    onClick={() => handleCopy(form.entrycode)}>
                    복사하기
                </RadioButton>
                </HalfGroup>
            </FormItem>
          </FormGroup>
        </Section>

        <Section>
          <Title>STEP 2. 수강생이 얼마나 강의를 들어야 하나요?</Title>
          
          <FormGroup>
            <HalfGroup>
            <FormHalfItem>
              <Label>
                커리큘럼 시작
                <Required>*</Required>
              </Label>
              <DisableInput
                value={new Date(form.startDate).toLocaleDateString()}
                disabled
                style={{width: '289px'}}
              />
            </FormHalfItem>

            <FormHalfItem>
              <Label>
                커리큘럼 주차
                <Required>*</Required>
              </Label>
              <CuliculumGroup>
              <DisableInput
                value={form.durationWeeks}
                disabled
                style={{width: '165px'}}
                />
                <Label style={{marginTop: '0px', marginLeft: '5px'}}>주</Label>
              </CuliculumGroup>
            </FormHalfItem>
            </HalfGroup>

            <FormItem>
              <Label>강의 시간</Label>
              <HalfGroup>
                <TimeGroup>
                    <DayButtonGroup>
                        {timeSlots.map((day) => (
                            <DayButton 
                            key={day}
                            active={form.lectureDays?.includes(timeSlots.indexOf(day) + 1)}
                            >
                            {day}
                            </DayButton>
                        ))}
                  </DayButtonGroup>
                </TimeGroup>

                <TimeGroup>
                <DisableInput
                  name='lectureTime'
                  style={{width: '289px'}}
                  value={isLecturePending ? '' : formatTimeWithMeridiem(form.lectureTime)}
                  disabled
                />
                </TimeGroup>

                <TimeGroup>
                  <PendingButton active={isLecturePending}>정해지지 않았어요</PendingButton>
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
                      active={form.assignmentDays?.includes(timeSlots.indexOf(day) + 1)}
                    >
                      {day}
                    </DayButton>
                  ))}
                  </DayButtonGroup>
                </TimeGroup>

                <TimeGroup>
                <DisableInput
                  name='assignmentTime'
                  style={{width: '289px'}}
                  value={isAssignmentPending ? '' : formatTimeWithMeridiem(form.assignmentTime)}
                  disabled
                />
                </TimeGroup> 

                <TimeGroup>
                  <PendingButton active={isAssignmentPending}>정해지지 않았어요</PendingButton>
                </TimeGroup>
              </HalfGroup>
            </FormItem>
          </FormGroup>
        </Section>

        <Section style={{borderBottom: 'none'}}>
          <Title>STEP 3. 수강생에게 강좌를 어떻게 공개하실 건가요?</Title>
          <FormGroup> 
            <FormItem>
            <RowContainer>
                <Label style={{marginRight: '50px'}}>수업 난이도<Required>*</Required></Label>
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
                </RowContainer>
                <LevelText>
                    {showDifficultyChange ? (
                        <HelpText>{showDifficultyChange}</HelpText>
                    ) : (
                        <>
                            {form.difficulty === 'easy' && <HelpText>입문자를 위한 쉬운 개념 강의!</HelpText>}
                            {form.difficulty === 'medium' && <HelpText>개념을 응용하고 실전 활용 능력을 키우는 강의!</HelpText>}
                            {form.difficulty === 'hard' && <HelpText>실무에 적용할 수 있는 전문 강의!</HelpText>}
                        </>
                    )}
                </LevelText>
            </FormItem>
          </FormGroup>
        </Section>
        <CreateButton onClick={handleSubmit}>강의실 업데이트하기</CreateButton>
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
  font-size: 13px;
  background-color: #FF4747;
  color: #FFFFFF;
`;

const PendingButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  background-color: ${props => props.active ? '#C3C3C3' : '#F4F4F4'};
  color: #909090;
`

const LevelButton = styled.button`
  border: none;
  border-radius: 10px;
  font-size: 15px;
  background-color: ${props => props.active ? '#FF4747' : '#EEEEEE '};
  color: ${props => props.active ? '#FFFFFF' : '#909090'};
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  margin-bottom: 8px
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
  margin-top: 31px;
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

const RowContainer = styled.div`
    display: flex;
    align-items: baseline;
    height: 50px;
`;

const LevelText = styled.div`
    margin-left: 150px;
`

const FormHalfItem = styled.div`
    margin-bottom: 15px;
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
  position: relative;
  color: #FF4747;
  font-weight: 800;
  top: -5px;
  left: 0px;
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

const DisableInput = styled.input`
  box-sizing: border-box;
  font-size: 13px;
  padding: 8px 12px;
  color: #000000;
  background-color: #F4F4F4;
  border: 2px solid #C3C3C3;
  border-radius: 10px;
  margin-right: 10px;
`

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
  background-color: ${props => props.active ? '#C3C3C3' : '#F4F4F4'};
  color: #909090;
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
