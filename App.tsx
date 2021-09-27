import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Home, Admin, AddEditTimerGroup } from "./src/pages";
import { RootStackParamList } from "./src/types";
import Toast from "react-native-toast-message";

const { Navigator, Screen } = createStackNavigator<RootStackParamList>();

export default function App() {
  const [selectedTimerId, setSelectedTimerId] = React.useState<string>(
    "seed-data-timer-group-0"
  );

  return (
    <NavigationContainer>
      <Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Screen name="Home" component={Home} />
        <Screen name="Admin">
          {() => (
            <Admin
              selectedTimerId={selectedTimerId}
              handleSetSelectedTimer={(id) => setSelectedTimerId(id)}
            />
          )}
        </Screen>
        <Screen name="AddEditTimerGroup">
          {() => <AddEditTimerGroup selectedTimerId={selectedTimerId} />}
        </Screen>
      </Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}
