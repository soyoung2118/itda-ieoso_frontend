import styled from "styled-components";
import Profile from "../../img/class/profile.svg";
import Done from "../../img/class/progress_done.svg";
import Undone from "../../img/class/progress_undone.svg";

const ScrollableTableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: auto;
  border-collapse: collapse;
  text-align: center;

  th,
  td {
    padding: 0.7rem 2.8rem;
    width:3rem;
    border-bottom: 1px solid #cdcdcd;
=  }

  th {
    font-size: 1.2rem;
    
    white-space: nowrap;
    
  }

  td {
    font-size: 1.05rem;
    font-weight: bold;
    white-space: nowrap;
  }

  td:first-child {
    text-align: left !important;
    padding-left: 0rem !important;
    padding-right: 10rem;
  }

`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  justify-content: flex-start;
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const CheckMarkIcon = styled.img`
  width: 1.7rem;
  height: 1.7rem;
`;

const StudentTable = () => {
  const data = {
    students: [
      {
        name: "김잇다",
        profile: { Profile },
        submissions: [
          true,
          false,
          true,
          false,
          true,
          true,
          true,
          false,
          true,
          false,
        ],
      },
      {
        name: "김잇다",
        profile: { Profile },
        submissions: [
          true,
          false,
          true,
          false,
          true,
          true,
          true,
          false,
          true,
          false,
        ],
      },
      {
        name: "김잇다",
        profile: { Profile },
        submissions: [
          true,
          false,
          true,
          false,
          true,
          true,
          true,
          false,
          true,
          false,
        ],
      },
      {
        name: "김잇다",
        profile: { Profile },
        submissions: [
          true,
          false,
          true,
          false,
          true,
          true,
          true,
          false,
          true,
          false,
        ],
      },
      {
        name: "김잇다",
        profile: { Profile },
        submissions: [
          true,
          false,
          true,
          false,
          true,
          true,
          true,
          false,
          true,
          false,
        ],
      },
      {
        name: "김잇다",
        profile: { Profile },
        submissions: [
          true,
          false,
          true,
          false,
          true,
          true,
          true,
          false,
          true,
          false,
        ],
      },
      {
        name: "김잇다",
        profile: { Profile },
        submissions: [
          true,
          false,
          true,
          false,
          true,
          true,
          true,
          false,
          true,
          false,
        ],
      },
      {
        name: "김잇다",
        profile: { Profile },
        submissions: [
          true,
          false,
          true,
          false,
          true,
          true,
          true,
          false,
          true,
          false,
        ],
      },
      {
        name: "김잇다",
        profile: { Profile },
        submissions: [
          true,
          false,
          true,
          false,
          true,
          true,
          true,
          false,
          true,
          false,
        ],
      },
      {
        name: "김잇다",
        profile: { Profile },
        submissions: [
          true,
          false,
          true,
          false,
          true,
          true,
          true,
          false,
          true,
          false,
        ],
      },
    ],
    assignments: 10,
  };

  const { students, assignments } = data;

  return (
    <ScrollableTableContainer>
      <span
        style={{ fontSize: "1.7rem", fontWeight: "550" }}
      >
        학생별 제출 현황
      </span>

      <Table>
        <thead>
          <tr>
            <th></th>
            {Array.from({ length: assignments }, (_, i) => (
              <th key={i}>과제 {i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>
                <ProfileContainer>
                  <ProfileImage src={Profile} alt="프로필" />
                  {student.name}
                </ProfileContainer>
              </td>
              {student.submissions.map((submitted, idx) => (
                <td key={idx}>
                  <CheckMarkIcon
                    src={submitted ? Done : Undone}
                    alt={submitted ? "제출 완료" : "미제출"}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </ScrollableTableContainer>
  );
};

export default StudentTable;
