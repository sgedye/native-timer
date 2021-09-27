import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Home, Admin, AddEditTimerGroup } from "./src/pages";
import { RootStackParamList } from "./src/types";
import Toast, { BaseToast } from "react-native-toast-message";

const { Navigator, Screen } = createStackNavigator<RootStackParamList>();

const toastConfig = {
  success: ({ text1 = "", ...rest }) => (
    <BaseToast
      {...rest}
      text1Style={{
        fontSize: 15,
        fontWeight: "600",
      }}
      text1={text1}
      text1NumberOfLines={2}
      text2NumberOfLines={2}
    />
  ),
};

export default function App() {
  return (
    <NavigationContainer>
      <Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Screen name="Home" component={Home} />
        <Screen name="Admin" component={Admin} />
        <Screen name="AddEditTimerGroup" component={AddEditTimerGroup} />
      </Navigator>
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}
