import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

const tabs: Tab[] = [
  { id: "tab1", label: "Tab 1", content: <div>Content of Tab 1</div> },
  { id: "tab2", label: "Tab 2", content: <div>Content of Tab 2</div> },
  { id: "tab3", label: "Tab 3", content: <div>Content of Tab 3</div> },
];

const TabContent = ({ tabId }: { tabId: string }) => {
  console.log("Clicked on Tab: " + tabId);
  const tab = tabs.find((t) => t.id === tabId);
  return tab ? tab.content : <div>Tab not found</div>;
};

const TabButtons = () => {
  const navigate = useNavigate();

  const handleTabChange = (tabId: string) => {
    navigate(`/${tabId}`);
  };

  return (
    <div>
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => handleTabChange(tab.id)}>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const TabbedSessions: React.FC = () => {
  return (
    <Router>
      <div>
        <TabButtons />
        <Routes>
          <Route path="/:tabId" element={<TabContent tabId={""} />} />
          <Route path="/" element={<TabContent tabId={tabs[0].id} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default TabbedSessions;
