import React from "react";
// (예시) import { getCurriculumWithAssignments, getAllAssignmentSubmissions } from "../../api/classCurriculumApi";

export default function AssignmentBrowseSidebar({ students, selectedId, onSelect }) {
  return (
    <SidebarWrapper>
      <MenuHeader>
        <span>다른 수강생 과제 둘러보기</span>
        <DropdownIcon>▼</DropdownIcon>
      </MenuHeader>
      <StudentList>
        {students.map((student) => (
          <StudentItem
            key={student.id}
            selected={student.id === selectedId}
            disabled={student.disabled}
            onClick={() => !student.disabled && onSelect(student.id)}
          >
            {student.name}
            {student.disabled && <span style={{ color: '#bbb', marginLeft: 4 }}>(나)</span>}
          </StudentItem>
        ))}
      </StudentList>
    </SidebarWrapper>
  );
}

import styled from "styled-components";

const SidebarWrapper = styled.div`
  width: 260px;
  min-width: 220px;
  background: #fff;
  height: 100%;
  box-sizing: border-box;
  border-radius: 16px;
  padding: 18px 0 0 0;
`;

const MenuHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  padding: 0 20px 10px 20px;
  border-bottom: 1px solid #E5E5E5;
  margin-bottom: 18px;
  justify-content: space-between;
`;

const DropdownIcon = styled.span`
  font-size: 18px;
  margin-left: 6px;
`;

const StudentList = styled.ul`
  list-style: none;
  padding: 0 0 0 0;
  margin: 0;
`;

const StudentItem = styled.li`
  padding: 10px 18px;
  margin: 0 10px 8px 10px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: ${({ selected }) => (selected ? 700 : 400)};
  color: ${({ disabled, selected }) =>
    disabled ? "#D3D3D3" : selected ? "#D7263D" : "#222"};
  background: ${({ selected }) => (selected ? "#FFE3E3" : "transparent")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background 0.15s;

  &:hover {
    background: ${({ disabled, selected }) =>
      disabled || selected ? "" : "#F8F8F8"};
  }
`;
