import MessageTab from "../components/archived/MessageTab";
import { SessionParams } from "./SessionParams";

export default interface ChildProps {
  currentTabCount: number;
  addNewTab: (sessionParams: SessionParams, index: number) => void;
  addTabsForAvailableSessions: () => void;
}
