import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Home, Admin, AddEditTimerGroup } from "./src/pages";
import { RootStackParamList } from "./src/types";
import Toast from "react-native-toast-message";

const { Navigator, Screen } = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Screen name="Home" component={Home} />
        <Screen name="Admin" component={Admin} />
        <Screen name="AddEditTimerGroup" component={AddEditTimerGroup} />
      </Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}
