import React from "react";

type Props = {
  title: string;
  index: number;
  setSelectedTab: (index: number) => void;
  className: string;
};

const setSelectedTab = (index: number) => {
  console.log(index);
};

const TabTitle: React.FC<Props> = ({
  title,
  setSelectedTab,
  index,
  className,
}) => {
  return (
    <li className="nav-item">
      <a className={className} onClick={() => setSelectedTab(index)}>
        {title}
      </a>
    </li>
  );
};

export default TabTitle;
