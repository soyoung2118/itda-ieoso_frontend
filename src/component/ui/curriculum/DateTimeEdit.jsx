import { useState, forwardRef, useEffect } from "react";
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
  width: 14rem;
  border: 2px solid #c3c3c3;
  border-radius: 8px;
  color: #c3c3c3;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.8rem 1rem;
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

const CustomInput = forwardRef(({ value, onClick, text }, ref) => {
  return (
    <InputBox
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      ref={ref}
    >
      <span>{value || text}</span>
      <Icon src={Calendar} alt="Calendar Icon" />
    </InputBox>
  );
});

// DateTimeEdit 컴포넌트
const DateTimeEdit = ({ initialStartDate, initialEndDate }) => {
  const [startDate, setStartDate] = useState(
    initialStartDate ? new Date(initialStartDate) : null
  );
  const [endDate, setEndDate] = useState(
    initialEndDate ? new Date(initialEndDate) : null
  );
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
    }
  };

  return (
    <div className="datetime-edit">
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
          {/* 업로드일 */}
          {initialStartDate && (
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              showTimeSelect
              dateFormat="yyyy년 MM월 dd일 HH:mm"
              customInput={<CustomInput text="업로드일" />}
            />
          )}

          {/* 마감일 */}
          {initialEndDate && (
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              showTimeSelect
              minDate={startDate} // 마감일은 시작일 이후만 가능
              dateFormat="yyyy년 MM월 dd일 HH:mm"
              customInput={<CustomInput text="마감일" />}
            />
          )}
        </DateRow>
      </DateTimeContainer>
    </div>
  );
};

export default DateTimeEdit;
