import { StackNavigationProp } from "@react-navigation/stack";
import { TimerGroup } from "./baseTypes";

export type RootStackParamList = {
  Home: { timerGroup: TimerGroup } | undefined;
  Admin: undefined;
  AddEditTimerGroup: { groupId: string } | undefined;
};

export type FooterComponentProp = StackNavigationProp<RootStackParamList>;
export type HomeScreenProp = StackNavigationProp<RootStackParamList, "Home">;
export type AdminScreenProp = StackNavigationProp<RootStackParamList, "Admin">;
export type AddEditTimerGroupScreenProp = StackNavigationProp<
  RootStackParamList,
  "AddEditTimerGroup"
>;
