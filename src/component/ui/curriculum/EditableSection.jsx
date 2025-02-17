import styled from "styled-components";
import { useState } from "react";
import PropTypes from "prop-types";
import DateTimeEdit from "../../ui/curriculum/DateTimeEdit";
import VideoIcon from "../../img/class/edit/video.svg";
import Material from "../../img/icon/pdf.svg";
import Assignment from "../../img/icon/docs.svg";
import Delete from "../../img/class/edit/delete.svg";
import Upload from "../../img/class/edit/upload.svg";

const Section = styled.div`
  display: flex;
  padding: 1.3rem 1.5rem;
  border-radius: 12px;
  margin: 1rem 0rem;
  background-color: #ffffff;
  position: relative;
  cursor: pointer;
  width: 100%;
`;

const VideoThumbnail = styled.div`
  width: 13rem;
  height: 7.7rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  display: flex;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  background-color: var(--lightgrey-color);
  color: #adadad;
  font-size: 1.1rem;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  background: none;
  font-size: 1.2rem;
  padding: 1.5vh 1.55vh;
  outline: none;
`;

const TextArea = styled.textarea`
  font-family: Pretendard, Pretendard-Bold, Pretendard-ExtraBold,
    Pretendard-Light, Pretendard-Medium, Pretendard-SemiBold, Pretendard-Thin,
    sans-serif;
  width: calc(100% - 3.5vh);
  font-size: 1.03rem;
  border: 2px solid #c3c3c3;
  border-radius: 7px;
  color: #c3c3c3;
  font-weight: bold;
  height: 7rem;
  text-align: start;
  vertical-align: top;
  resize: none;
  overflow: auto;
  padding: 1.5vh 1.55vh;
`;

const MaterialSection = styled.div`
  display: flex;
  background-color: var(--lightgrey-color);
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.07rem;
`;

const GrayLine = styled.div`
  width: 100%;
  height: 0.9px;
  background-color: #c3c3c3;
  margin-top: 1.2rem;
  margin-bottom: 1.1rem;
`;

const getYouTubeThumbnail = (url) => {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return videoIdMatch
    ? `https://img.youtube.com/vi/${videoIdMatch[1]}/0.jpg`
    : null;
};

const EditableSection = ({ subSection, handleDelete, index }) => {
  const [title, setTitle] = useState(subSection?.title || "");
  const [videoUrl, setVideoUrl] = useState(subSection?.videoUrl || "");
  const [thumbnail, setThumbnail] = useState(getYouTubeThumbnail(videoUrl));
  const [uploadedFile, setUploadedFile] = useState(null);
  const [period, setPeriod] = useState(
    subSection?.startDate && subSection?.endDate
      ? `${subSection.startDate} ~ ${subSection.endDate}`
      : "기간 미정"
  );
  const [assignmentDescription, setAssignmentDescription] = useState(subSection?.assignmentDescription || "");

  const handleVideoInput = () => {
    const newThumbnail = getYouTubeThumbnail(videoUrl);
    if (newThumbnail) {
      setThumbnail(newThumbnail);
    } else {
      alert("올바른 유튜브 URL을 입력하세요.");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  return (
    <Section>
      <div style={{ width: "99%" }}>
        {subSection.contentType === "video" && (
          <div>
            <DateTimeEdit
              initialStartDate={subSection.startDate}
              initialEndDate={subSection.endDate}
            />
            <div style={{ display: "flex" }}>
              <div style={{ alignSelf: "flex-start" }}>
                <img
                  src={VideoIcon}
                  style={{
                    width: "2.6rem",
                    marginLeft: "1rem",
                    marginRight: "3rem",
                  }}
                />
              </div>

              <div style={{ display: "flex", width: "100%" }}>
                <VideoThumbnail>
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt="YouTube 썸네일"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "유튜브 영상 썸네일"
                  )}
                </VideoThumbnail>

                <div
                  style={{
                    marginLeft: "2rem",
                    height: "100%",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="강의명을 작성해주세요."
                      style={{
                        border: "2px solid #c3c3c3",
                        borderRadius: "7px",
                        color: "#c3c3c3",
                        padding: "15px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    <Input
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="유튜브 영상 링크를 입력해주세요. - https://youtu.be"
                      style={{
                        border: "2px solid #c3c3c3",
                        borderRadius: "7px",
                        color: "#c3c3c3",
                        padding: "15px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      onClick={handleVideoInput}
                      style={{
                        backgroundColor: "var(--main-color)",
                        color: "var(--white-color)",
                        width: "30%",
                        marginLeft: "1rem",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      영상 입력하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {subSection.contentType === "material" && (
          <div>
            <div style={{ display: "flex" }}>
              <img
                src={Material}
                style={{
                  width: "2.4rem",
                  marginLeft: "1rem",
                  marginRight: "3rem",
                }}
              />
              <MaterialSection style={{ border: "2px solid #c3c3c3" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={Upload}
                    style={{ width: "1.2rem", marginRight: "1rem" }}
                  />
                  <span style={{ color: "#c3c3c3", fontWeight: "bold" }}>
                    {uploadedFile || "파일 업로드"}
                  </span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </MaterialSection>
            </div>
          </div>
        )}

        {subSection.contentType === "assignment" && (
          <div>
            <DateTimeEdit  initialStartDate={subSection.startDate} initialEndDate={subSection.endDate} />
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <img
                src={Assignment}
                style={{
                  width: "2.4rem",
                  marginLeft: "1rem",
                  marginRight: "3rem",
                }}
              />
              <div style={{ width: "100%" }}>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="과제명을 작성해주세요."
                  style={{
                    border: "2px solid #c3c3c3",
                    borderRadius: "7px",
                    color: "#c3c3c3",
                    padding: "15px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    width: "100%",
                    boxSizing: "border-box",
                    marginBottom: "1rem",
                    fontFamily:
                      "Pretendard, Pretendard-Bold, Pretendard-ExtraBold, Pretendard-Light, Pretendard-Medium, Pretendard-SemiBold, Pretendard-Thin, sans-serif",
                  }}
                />
                <TextArea
                  value={assignmentDescription}
                  onChange={(e) => setAssignmentDescription(e.target.value)}
                  placeholder="설명을 작성해주세요."
                ></TextArea>
              </div>
            </div>
          </div>
        )}
        <div
          style={{
            marginTop: "1rem",
            width: "100%", // Section 전체 너비 사용
          }}
        >
          <GrayLine
            style={{
              width: "100%", // Section 전체 너비를 사용
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end", // 오른쪽 끝 정렬
              marginTop: "0.5rem", // 간격 조정
            }}
          >
            <img
              src={Delete}
              alt="삭제 아이콘"
              style={{
                width: "1.25rem",
                cursor: "pointer",
                marginRight: "1rem",
                marginBottom: "0.5rem",
              }}
              onClick={(e) => {
                e.stopPropagation(); // 클릭 이벤트 버블링 방지
                handleDelete(index, subSection.contentType, subSection.contentOrderId);
              }}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default EditableSection;
