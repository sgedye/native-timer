import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Home: undefined;
  Admin: undefined;
  AddEditTimerGroup: { id: string } | undefined;
};

export type FooterComponentProp = StackNavigationProp<RootStackParamList>;
export type HomeScreenProp = StackNavigationProp<RootStackParamList, "Home">;
export type AdminScreenProp = StackNavigationProp<RootStackParamList, "Admin">;
export type AddEditTimerGroupScreenProp = StackNavigationProp<
  RootStackParamList,
  "AddEditTimerGroup"
>;
