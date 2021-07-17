export type TimerGroup = {
  id: string;
  name: string;
  data: Timer[];
};

export interface Timer {
  id: string;
  time: number;
  desc: string;
}
