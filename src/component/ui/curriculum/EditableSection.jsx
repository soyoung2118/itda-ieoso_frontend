import styled from "styled-components";
import { useState } from "react";
import PropTypes from "prop-types";
import DateTimeEdit from "../../ui/curriculum/DateTimeEdit";
import Material from "../../img/icon/pdf.svg";
import Assignment from "../../img/icon/docs.svg";
import Delete from "../../img/class/edit/delete.svg";

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
  width: 14.5rem;
  height: 8rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  display: flex;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  background-color: #d9d9d9;
  color: #adadad;
  font-size: 1.15rem;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  background: none;
  font-size: 1.2rem;
  padding: 0.5rem;
  outline: none;
`;

const MaterialSection = styled.div`
  display: flex;
  background-color: var(--lightgrey-color);
  width: 100%;
  padding: 1.2rem 1.5rem;
  border-radius: 8px;
  font-size: 1.07rem;
`;

const GrayLine = styled.div`
  position: relative;
  height: 1.8px;
  background-color: #c3c3c3;
  margin-top: 2rem;
  margin-bottom: 3rem;
`;

const EditableSection = ({ subSection, type, handleSave }) => {
  const [title, setTitle] = useState(subSection?.title || "");
  const [period, setPeriod] = useState(
    subSection?.period || "2025-01-06 10:00 ~ 2025-01-12 23:59"
  );

  return (
    <Section>
      <div style={{ width: "100%" }}>
        {type === "video" && (
          <div style={{ display: "flex" }}>
            <VideoThumbnail>
              영상 업로드 <br /> or 링크 붙여넣기
            </VideoThumbnail>

            <div style={{ flex: 1, marginLeft: "2rem" }}>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 작성해주세요."
                style={{
                  border: "2px solid #c3c3c3",
                  borderRadius: "7px",
                  width: "97%",
                  color: "#c3c3c3",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              />
              <p style={{ color: "#909090" }}>김잇다 | {period}</p>
            </div>
          </div>
        )}

        {type === "material" && (
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
              <MaterialSection>
                <span style={{ marginRight: "0.6rem" }}>
                  {title ?? "자료를 첨부해주세요"}
                </span>
                <span
                  style={{ color: "var(--main-color)", fontSize: "0.9rem" }}
                >
                  3.1MB
                </span>
              </MaterialSection>
            </div>
            <GrayLine />
          </div>
        )}

        {type === "assignment" && (
          <div>
            <DateTimeEdit />
            <div style={{ display: "flex" }}>
              <img
                src={Assignment}
                style={{
                  width: "2.4rem",
                  marginLeft: "1rem",
                  marginRight: "3rem",
                }}
              />
              <MaterialSection>
                <span style={{ marginRight: "0.6rem" }}>
                  {title ?? "자료를 첨부해주세요"}
                </span>
                <span
                  style={{ color: "var(--main-color)", fontSize: "0.9rem" }}
                >
                  3.1MB
                </span>
              </MaterialSection>
            </div>
            <GrayLine />
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <img
            src={Delete}
            alt="삭제 아이콘"
            style={{ width: "1rem", cursor: "pointer" }}
          />
        </div>
      </div>
    </Section>
  );
};

export default EditableSection;
