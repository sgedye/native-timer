import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Home, Admin, AddEditTimerGroup } from "./src/pages";

import data from "./src/data/data.json";
import { RootStackParamList } from "./src/types";

const { Navigator, Screen } = createStackNavigator<RootStackParamList>();

export default function App() {
  const storeData = async (data: any) => {
    try {
      await AsyncStorage.setItem("data", JSON.stringify(data));
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  React.useEffect(() => {
    storeData(data);
    console.log("storedDated");
  }, []);

  return (
    <NavigationContainer>
      <Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Screen name="Home" component={Home} />
        <Screen name="Admin" component={Admin} />
        <Screen name="AddEditTimerGroup" component={AddEditTimerGroup} />
      </Navigator>
    </NavigationContainer>
  );
}
