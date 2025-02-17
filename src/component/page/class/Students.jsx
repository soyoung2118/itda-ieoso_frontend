import { useState, useEffect } from "react";
import AdminTopBar from "../../ui/class/AdminTopBar";
import { Section } from "../../ui/class/ClassLayout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { themeQuartz } from "ag-grid-community";
import assignmentIcon from "../../img/admin/student_assignment.svg";

const ClassStudents = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [assignmentCreatedAt, setAssignmentCreatedAt] = useState("2025.01.01");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = `${now.getFullYear()}.${
        now.getMonth() + 1
      }.${now.getDate()}`;
      setCurrentTime(
        `${formattedTime} ${now.getHours()}:${String(now.getMinutes()).padStart(
          2,
          "0"
        )}`
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const [rowData] = useState([
    {
      name: "김잇다",
      assignment1: "김잇다.pdf",
      assignment2: "김잇다.jpg",
      assignment3: "김잇다.docx",
      assignment4: "김잇다.pptx",
      assignment5: "김잇다.png",
    },
    {
      name: "홍길동",
      assignment1: "홍길동.pdf",
      assignment2: "홍길동.jpg",
      assignment3: "홍길동.docx",
      assignment4: "홍길동.pptx",
      assignment5: "홍길동.png",
    },
  ]);

  const myTheme = themeQuartz.withParams({
    spacing: 2,
    foregroundColor: "rgb(14, 68, 145)",
    backgroundColor: "rgb(241, 247, 255)",
    headerBackgroundColor: "rgb(228, 237, 250)",
    rowHoverColor: "rgb(216, 226, 255)",
  });

  const AssignmentIconRenderer = ({ value }) => (
    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <img src={assignmentIcon} alt="Assignment" width="16" height="16" />
      <a href={`/${value}`} style={{ color: "red", textDecoration: "none" }}>
        {value}
      </a>
    </span>
  );

  const columnDefs = [
    {
      headerName: "이름",
      field: "name",
      width: 120,
      headerComponentFramework: () => (
        <div
          style={{
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
            padding: "10px",
            textAlign: "center",
            borderRadius: "8px",
          }}
        >
          이름
        </div>
      ),
    },
    ...["과제 1", "과제 2", "과제 3", "과제 4", "과제 5"].map(
      (title, index) => ({
        headerName: title,
        field: `assignment${index + 1}`,
        cellRenderer: AssignmentIconRenderer,
        headerComponentFramework: () => (
          <div
            style={{
              fontWeight: "bold",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              backgroundColor: "rgb(228, 237, 250)",
              borderRadius: "8px",
            }}
          >
            <img
              src={assignmentIcon}
              alt="과제"
              style={{ width: "16px", height: "16px" }}
            />
            <span>{title}</span>
            <small style={{ fontSize: "0.8rem", color: "gray" }}>
              {assignmentCreatedAt}
            </small>
          </div>
        ),
      })
    ),
  ];

  return (
        <main style={{ flex: 1, borderRadius: "8px" }}>
          <AdminTopBar />
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "900",
                color: "var(--black-color)",
              }}
            >
              학생별 제출 현황
            </h3>
            <p
              style={{
                color: "var(--darkgrey-color)",
                fontSize: "18px",
                marginLeft: "18px",
                fontWeight: "500",
              }}
            >
              {currentTime} 기준
            </p>
          </div>
          <Section style={{ padding: "2rem 3rem" }}>
            <div
              className={`ag-theme-alpine ${myTheme}`}
              style={{
                height: "600px",
                width: "100%",
                margin: "20px 0",
                borderRadius: "8px",
                overflowX: "auto",
              }}
            >
              <AgGridReact
                modules={[ClientSideRowModelModule]}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                }}
                domLayout="autoHeight"
                headerHeight={50}
                rowHeight={60}
                pagination={true}
                paginationPageSize={500}
                paginationPageSizeSelector={[200, 500, 1000]}
                getRowStyle={(params) => ({
                  backgroundColor:
                    params.node.rowIndex % 2 === 0 ? "#f9f9f9" : "#fff",
                })}
              />
            </div>
          </Section>
        </main>
  );
};

export default ClassStudents;
