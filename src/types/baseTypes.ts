export type TimerGroup = {
  timerGroupId: string;
  timerGroupName: string;
  timers: Timer[];
};

export interface Timer {
  timerId: string;
  time: number;
  desc: string;
}
