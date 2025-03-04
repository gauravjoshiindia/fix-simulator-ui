import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import MessageTab from "./archived/MessageTab";
import MaterialMessageGrid from "./MaterialMessageGrid";
import { SessionParams } from "../interfaces/SessionParams";
import { IconButton, Typography } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface LabTabsProps {
  tabs: MessageTab[];
  removeTab: (sessionParams: SessionParams) => void;
}

export function LabTabs(tabsProps: LabTabsProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabsProps.tabs.map((tab: MessageTab) => (
            <Tab
              label={
                <span>
                  {tab.title}
                  <IconButton
                    hidden={value !== tab.index}
                    size="small"
                    component="span"
                    onClick={() => {
                      alert("Closing this tab will also Logout the Session");
                      setValue(value - 1);
                      tabsProps.removeTab(tab.sessionParams);
                    }}
                  >
                    <GridCloseIcon />
                  </IconButton>
                </span>
              }
              key={tab.index}
              {...a11yProps(tab.index)}
            />
          ))}
        </Tabs>
      </Box>
      {tabsProps.tabs.map((tab: MessageTab) => (
        <CustomTabPanel value={value} index={tab.index} key={tab.index}>
          <MaterialMessageGrid
            sessionParams={tab.sessionParams}
            removeTab={tabsProps.removeTab}
          />
        </CustomTabPanel>
      ))}
    </Box>
  );
}
