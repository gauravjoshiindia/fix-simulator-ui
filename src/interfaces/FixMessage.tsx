export interface FixMessage {
  fixVersion: string;
  messageType: string;
  messageText: string;
  sendingTime: string;
  senderCompId: string;
  targetCompId: string;
}
