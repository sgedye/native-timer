export interface TimerList {
  id: string;
  name: string;
  data: Timer[];
}

export type TimerGroup = {
  id: string;
  name: string;
  data: Timer[];
};

export interface Timer {
  time: number;
  desc: string;
}
