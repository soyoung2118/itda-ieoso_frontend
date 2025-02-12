import { useState, forwardRef } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateTime from "../../img/class/edit/datetime.svg";
import Calendar from "../../img/class/edit/calendar.svg";

const DateTimeContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 100%;
  margin-bottom: 1rem;
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  width: 12rem;
  border: 2px solid #c3c3c3;
  border-radius: 8px;
  color: #c3c3c3;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  flex: 1;
  justify-content: space-between;
`;

const Icon = styled.img`
  width: 1rem;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <InputBox
    onClick={(e) => {
      e.stopPropagation();
      onClick(e);
    }}
    ref={ref}
  >
    <span>{value || "날짜 선택"}</span>
    <Icon src={Calendar} alt="Calendar Icon" />
  </InputBox>
));

// DateTimeEdit 컴포넌트
const DateTimeEdit = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setError("시작일은 마감일보다 이전이어야 합니다.");
    } else {
      setError("");
    }
  };

  const handleEndDateChange = (date) => {
    if (startDate && date < startDate) {
      setError("마감일은 시작일보다 이후이어야 합니다.");
    } else {
      setEndDate(date);
      setError("");
    }
  };

  return (
    <DateTimeContainer>
      <DateRow>
        <img
          src={DateTime}
          style={{
            width: "2.5rem",
            marginLeft: "1rem",
            marginRight: "1rem",
            alignSelf: "center",
          }}
        />
        {/* 시작일 */}
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          showTimeSelect
          dateFormat="yyyy년 MM월 dd일 HH:mm"
          customInput={<CustomInput />}
        />

        {/* 마감일 */}
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          showTimeSelect
          minDate={startDate} // 마감일은 시작일 이후만 가능
          dateFormat="yyyy년 MM월 dd일 HH:mm"
          customInput={<CustomInput />}
        />
      </DateRow>
    </DateTimeContainer>
  );
};

export default DateTimeEdit;
