import ClassSidebar from "../../ui/class/ClassSidebar";
import ClassTopbar from "../../ui/class/ClassTopbar";
import { useState } from "react";
import TopBar from "../../ui/TopBar";
import styled from "styled-components";
import { PageLayout, Section } from "../../ui/class/ClassLayout";
import EditButton from "../../ui/class/EditButton";


const Title = styled.h1`
  font-size: 2.6rem;
  font-weight: bold;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 20rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid var(--black-color);
  border-radius: 30px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled.span`
  font-size: 1.9rem;
  color: var(--grey-color);
  cursor: pointer;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const NoticeList = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--black-color);
  padding: 1.3rem;
`;

const NoticeItemLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0rem; 
`;


const NoticeItem = styled.div`
  padding: 1.5rem;
  border-bottom: 1.5px solid #cdcdcd; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: var(--lightgrey-color);
  }
`;


const NoticeTitle = styled.h3`
  font-size: 1.35rem;
  font-weight: 550;
  color: var(--black-color);
  margin-bottom: 0.8rem;
`;

const NoticeMeta = styled.div`
  font-size: 0.9rem;
  color: #474747;
  display: flex;
  gap: 0.3rem; 
  margin-bottom: 1.2rem;
  font-weight: semi-bold;
`;




const NoticeViews = styled.div`
  text-align: center;
  color: var(--main-color);
  font-size: 1.25rem;
  font-weight: bold;

  div {
    font-size: 0.875rem; 
    color: #474747;
    margin-top: 0.25rem;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  margin: 2rem;
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background-color: ${(props) =>
    props.active ? "var(--pink-color)" : "transparent"};
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  &:hover {
    background-color: var(--lightgrey-color);
  }
`;

const Icon = styled.span`
  font-size: 1.5rem;
  color: var(--black-color);
`;

const ClassNotice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const items = ["강의 개요", "강의 공지"];
  const [activeItem, setActiveItem] = useState("강의 공지");
  const routes = ["/overview/info", "/overview/announcement"];

  const notices = [
    {
      id: 1,
      title: "1기 환급 안내사항",
      author: "김잇다",
      date: "25.01.11 13:15",
      views: 25,
    },
    {
      id: 2,
      title: "1기 환급 안내사항",
      author: "김잇다",
      date: "25.01.11 13:15",
      views: 25,
    },
    {
      id: 3,
      title: "1기 환급 안내사항",
      author: "김잇다",
      date: "25.01.11 13:15",
      views: 25,
    },
    {
      id: 4,
      title: "1기 환급 안내사항",
      author: "김잇다",
      date: "25.01.11 13:15",
      views: 25,
    },
    {
      id: 5,
      title: "1기 환급 안내사항",
      author: "김잇다",
      date: "25.01.11 13:15",
      views: 25,
    },
  ];

  return (
    <div>
      <TopBar />
      <PageLayout>
        <ClassTopbar activeTab="overview" />
        <div style={{ display: "flex", marginTop: "1rem" }}>
          <ClassSidebar
            items={items}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            routes={routes}
            style={{ marginRight: "2rem" }}
          />
          <main
            style={{
              flex: 1,
              padding: "2rem",
              borderRadius: "8px",
            }}
          >
            <ContentHeader>
              <Title>공지사항</Title>
              <SearchContainer>
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon className="material-symbols-outlined" style={{color:"var(--black-color)", fontSize:"2.7rem"}}>
                  search
                </SearchIcon>
              </SearchContainer>
            </ContentHeader>

            <Section>
              <NoticeList>
                {notices.map((notice) => (
                  <NoticeItem key={notice.id}>
                    <NoticeItemLeft>
                      <NoticeTitle>{notice.title}</NoticeTitle>
                      <NoticeMeta>
                        <span>{notice.author}</span>
                        <span>|</span>
                        <span>{notice.date}</span>
                      </NoticeMeta>
                    </NoticeItemLeft>
                    <NoticeViews>
                      {notice.views}
                      <div>조회수</div>
                    </NoticeViews>
                  </NoticeItem>
                ))}
              </NoticeList>
              <Pagination>
                <PageButton onClick={() => setCurrentPage(currentPage - 1)}>
                  <Icon className="material-symbols-outlined" style={{fontSize:"1.3rem"}}>arrow_back_ios</Icon>
                </PageButton>
                <PageButton
                  active={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </PageButton>
                <PageButton
                  active={currentPage === 2}
                  onClick={() => setCurrentPage(2)}
                >
                  2
                </PageButton>
                <PageButton onClick={() => setCurrentPage(currentPage + 1)}>
                  <Icon className="material-symbols-outlined" style={{fontSize:"1.3rem"}}>arrow_forward_ios</Icon>
                </PageButton>
              </Pagination>
            </Section>
          </main>
        </div>
      </PageLayout>
      <EditButton to="/overview/notice/create" edit={true} />
    </div>
  );
};

export default ClassNotice;