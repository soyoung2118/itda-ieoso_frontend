import {BrowserRouter, Route, Routes} from "react-router-dom";
import Start from "./component/page/Start.jsx";
import ClassCurriculum from "./component/page/class/ClassCurriculum.jsx";
import ClassOverview from "./component/page/class/ClassOverview.jsx";
import ClassNotice from "./component/page/class/ClassNotice.jsx";
import ClassStat from "./component/page/class/ClassStat.jsx";
import EditClass from "./component/ui/class/EditClass.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start/>}/>

          <Route path="/overview/info" element={<ClassOverview />} />
          <Route path="/overview/info/edit" element={<EditClass />} />
          <Route path="/overview/notice" element={<ClassNotice />} />
          <Route path="/curriculum" element={<ClassCurriculum />} />
          <Route path="/stat" element={<ClassStat/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
