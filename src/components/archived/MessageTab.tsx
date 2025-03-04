import { SessionParams } from "../../interfaces/SessionParams";

export default interface MessageTab {
  index: number;
  title: string;
  isVisible: boolean;
  sessionParams: SessionParams;
}
