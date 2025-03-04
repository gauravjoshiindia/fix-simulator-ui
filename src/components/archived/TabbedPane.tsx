import React, { useState } from "react";
import FixSessionForm from "../FixSessionForm";
import MessageGrid from "../MessageGrid";

interface Tab {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  return (
    <div>
      <ul className="nav nav-tabs">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.title}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane ${activeTab === tab.id ? "active" : ""}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

const TabbedPane: React.FC = () => {
  const tabData: Tab[] = [
    {
      id: "home",
      title: "Home",
      content: (
        <section id="about-section" className="pt-5 pb-5">
          <FixSessionForm />
        </section>
      ),
    },
    {
      id: "profile",
      title: "Message Browser",
      content: (
        <section id="about-section" className="pt-5 pb-5">
          <MessageGrid />
        </section>
      ),
    },
    {
      id: "contact",
      title: "Contact",
      content: <div>Contact content</div>,
    },
  ];

  return (
    <div className="container mt-4">
      <Tabs tabs={tabData} />
    </div>
  );
};

export default TabbedPane;
