import React from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  StyleSheet,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { adminScreenProp, Timer, TimerList } from "../types";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";

import { uuid } from "uuidv4";

import data from "../data/data.json";
import { ListItem } from "../ui";
import { TextInput } from "react-native-gesture-handler";

export const Admin: React.FC<Record<string, never>> = () => {
  const navigation = useNavigation<adminScreenProp>();
  const [mode, setMode] = React.useState<Timer[]>(data[0].data);
  const [options, setOptions] = React.useState<TimerList[]>(data || []);
  // const [timerList, setTimerList] = React.useState<Timer[]>([]);

  const deleteItem = (id: number) => {};

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="auto" />
      <View style={styles.section20}>
        <Text>admin page</Text>
      </View>
      <View style={styles.section80}>
        <Button title="Login" onPress={() => navigation.navigate("Home")} />

        <FlatList
          data={options}
          renderItem={({ item }) => <ListItem title={item.name} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  section20: {
    flex: 2,
    backgroundColor: "orange",
  },
  section80: {
    flex: 8,
    backgroundColor: "dodgerblue",
  },
});
