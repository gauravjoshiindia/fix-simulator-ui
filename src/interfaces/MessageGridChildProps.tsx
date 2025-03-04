import { SessionParams } from "./SessionParams";

export interface MessageGridChildProps {
  sessionParams: SessionParams;
  removeTab: (sessionParams: SessionParams) => void;
}
