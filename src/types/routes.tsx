import { StackNavigationProp } from "@react-navigation/stack";

// import { Home, Admin } from "../pages";

type RootStackParamList = {
  Home: undefined;
  Admin: undefined;
  AddEditTimerGroup: undefined;
  // Home: { screen: keyof typeof Home };
  // Admin: { screen: keyof typeof Admin };
};

export type footerComponentProp = StackNavigationProp<RootStackParamList>;
export type homeScreenProp = StackNavigationProp<RootStackParamList, "Home">;
export type adminScreenProp = StackNavigationProp<RootStackParamList, "Admin">;
export type addEditTimerGroupScreenProp = StackNavigationProp<
  RootStackParamList,
  "AddEditTimerGroup"
>;
