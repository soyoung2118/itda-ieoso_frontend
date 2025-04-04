import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminTopBar from "../../ui/class/AdminTopBar";
import { Section } from "../../ui/class/ClassLayout";
import profileIcon from "../../img/icon/usericon.svg";
import api from "../../api/api";

const ClassStudents = () => {
  const { courseId } = useParams();
  const [currentTime, setCurrentTime] = useState("");
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();

  const tableRef = useRef(null);
  const scrollbarThumbRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [activeRow, setActiveRow] = useState(null);

  useEffect(() => {
    const now = new Date();
    const formatted = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
    setCurrentTime(
      `${formatted} ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`,
    );
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get(
          `/statistics/courses/${courseId}/assignments/submissions`,
        );
        if (res.data.success) {
          const data = res.data.data;
          const grouped = {};
          const titleMap = {};

          data.forEach((assignment) => {
            titleMap[assignment.assignmentId] =
              assignment.assignmentTitle || "과제 제목을 입력하세요.";
            assignment.studentResults.forEach((result) => {
              if (!grouped[result.userId]) {
                grouped[result.userId] = {
                  userId: result.userId,
                  name: result.studentName,
                };
              }
              grouped[result.userId][assignment.assignmentId] = {
                files: result.files || [],
                textContent: result.textContent || null,
              };
            });
          });

          const processed = Object.values(grouped).map((student) => ({
            ...student,
            assignments: Object.keys(titleMap).map((id) => ({
              title: titleMap[id],
              value: student[id] || { files: [], textContent: null },
            })),
          }));

          setRowData(processed);
        }
      } catch (err) {
        console.error("불러오기 실패:", err);
      }
    };

    fetchAssignments();
  }, [courseId]);

  const handleScroll = () => {
    const scrollWidth =
      tableRef.current.scrollWidth - tableRef.current.clientWidth;
    const scrollbarWidth = scrollbarThumbRef.current.parentElement.offsetWidth;

    const thumbWidth =
      (tableRef.current.clientWidth / tableRef.current.scrollWidth) *
      scrollbarWidth;
    scrollbarThumbRef.current.style.width = `${thumbWidth}px`;

    const thumbPosition =
      (tableRef.current.scrollLeft / scrollWidth) *
      (scrollbarWidth - thumbWidth);
    scrollbarThumbRef.current.style.transform = `translateX(${thumbPosition}px)`;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.userSelect = "auto";
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = tableRef.current.scrollLeft;
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const dx = e.clientX - startX.current;

    const scrollWidth =
      tableRef.current.scrollWidth - tableRef.current.clientWidth;
    const scrollbarWidth = scrollbarThumbRef.current.parentElement.offsetWidth;

    const thumbWidth =
      (tableRef.current.clientWidth / tableRef.current.scrollWidth) *
      scrollbarWidth;

    const moveRatio = scrollWidth / (scrollbarWidth - thumbWidth);

    tableRef.current.scrollLeft = scrollLeft.current + dx * moveRatio;
  };

  useEffect(() => {
    const tableEl = tableRef.current;

    tableEl.addEventListener("scroll", handleScroll);
    handleScroll();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      tableEl.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <main style={mainStyle}>
      <AdminTopBar />
      <div style={headerWrapStyle}>
        <div style={headerTitleRowStyle}>
          <h3 style={headerTitleStyle}>전체 과제 보기</h3>
          <p style={headerTimeStyle}>{currentTime} 기준</p>
        </div>
        <Section style={sectionStyle}>
          <div style={scrollWrapperStyle}>
            <div ref={tableRef} style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thNameStyle}>이름</th>
                    {rowData[0]?.assignments.map((a, i) => (
                      <th key={i} style={thStyle}>
                        {a.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rowData.map((student, i) => (
                    <tr
                      key={i}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => {
                        setActiveRow(i);
                        navigate(
                          `/class/${courseId}/admin/students/${student.userId}`,
                        );
                      }}
                      style={{
                        ...(i % 2 === 1 ? rowAltStyle : rowStyle),
                        ...(activeRow === i || hoveredRow === i
                          ? rowActiveStyle
                          : {}),
                      }}
                    >
                      <td style={tdNameStyle}>
                        <img src={profileIcon} alt="프로필" style={imgStyle} />
                        {student.name}
                      </td>
                      {student.assignments.map((a, j) => (
                        <td key={j} style={tdStyle}>
                          {a.value.files.length > 0 &&
                            a.value.files.map((file, k) => (
                              <div
                                key={k}
                                style={{
                                  ...badgeStyle,
                                  color: "var(--main-color)",
                                }}
                              >
                                {file.fileName}
                              </div>
                            ))}

                          {a.value.textContent && (
                            <div style={{ ...badgeStyle, color: "black" }}>
                              {a.value.textContent}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={scrollBarStyle}>
              <div
                ref={scrollbarThumbRef}
                style={scrollThumbStyle}
                onMouseDown={handleMouseDown}
              />
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
};

const mainStyle = { flex: 1 };
const tableWrapperStyle = {
  overflowX: "auto",
  position: "relative",
  width: "100%",
};
const headerWrapStyle = { margin: "1vh 0" };
const headerTitleRowStyle = {
  display: "flex",
  alignItems: "baseline",
  marginLeft: "2.5vh",
};
const headerTitleStyle = {
  fontSize: "24px",
  fontWeight: "700",
  color: "var(--black-color)",
};
const headerTimeStyle = {
  color: "var(--darkgrey-color)",
  fontSize: "15px",
  marginLeft: "1.5vh",
  fontWeight: "500",
};
const sectionStyle = { padding: "2vh 3.5vh" };

const scrollWrapperStyle = {
  width: "100%",
  position: "relative",
  overflowX: "hidden",
};

const scrollBarStyle = {
  marginTop: "1rem",
  height: "8px",
  width: "100%",
  background: "#f1f1f1",
  borderRadius: "10px",
  overflow: "hidden",
};

const scrollThumbStyle = {
  height: "100%",
  background: "#c4c4c4",
  borderRadius: "10px",
  cursor: "pointer",
  position: "relative",
  transition: "background-color 0.3s ease",
};

const imgStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  verticalAlign: "middle",
  marginRight: "8px",
};

const tableStyle = {
  width: "100%",
  minWidth: "1600px",
  borderCollapse: "separate",
  borderSpacing: 0,
  fontSize: "17.5px",
};

const thStyle = {
  padding: "2vh 2.3vh",
  whiteSpace: "nowrap",
  fontSize: "18.5px",
  fontWeight: "700",
  textAlign: "center",
};

const thNameStyle = {
  ...thStyle,
  minWidth: "20vh",
  textAlign: "left",
  paddingLeft: "5vh",
};

const tdStyle = {
  padding: "1vh 2vh",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
  textAlign: "center",
};

const tdNameStyle = {
  ...tdStyle,
  textAlign: "left",
  paddingLeft: "2vh",
  fontWeight: "600",
};

const rowStyle = {
  backgroundColor: "white",
  cursor: "pointer",
};

const rowAltStyle = {
  backgroundColor: "#ffffff",
  cursor: "pointer",
};

const rowActiveStyle = {
  backgroundColor: "#F6F7F9",
  transition: "background-color 0.2s ease-in-out",
};

const badgeStyle = {
  background: "#fdfdfd",
  border: "1.5px solid #E6E6E6",
  borderRadius: "14px",
  padding: "1vh 1.4vh",
  display: "block",
  margin: "0.3vh 0",
  maxWidth: "20vh",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export default ClassStudents;
