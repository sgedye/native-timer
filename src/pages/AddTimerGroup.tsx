import * as React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { v4 as uuid } from "uuid";
import { useNavigation } from "@react-navigation/native";

import {
  addTimerGroupScreenProp,
  Timer,
  TimerGroup,
  TimerList,
} from "../types";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";
import { DataInput, Spacer } from "../ui";
import { Footer } from "../components";
import { FontAwesome } from "@expo/vector-icons";

export const AddTimerGroup: React.FC<Record<string, never>> = () => {
  const navigation = useNavigation<addTimerGroupScreenProp>();

  const [timerGroupTitle, setTimerGroupTitle] = React.useState<string>("");
  const [options, setOptions] = React.useState<TimerGroup[]>([]);
  // const [newTimer, setNewTimer] = React.useState<TimerGroup | null>(null);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("data");
      console.log("admin", jsonValue);
      if (jsonValue) {
        setOptions(JSON.parse(jsonValue));
        return JSON.parse(jsonValue);
      }
      setOptions([]);
      return null;
    } catch (e) {
      console.log("Error Reading: ", e);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  const updateTitle = (title: string) => {
    setTimerGroupTitle(title);
  };

  const onAddTimerGroup = async () => {
    if (!timerGroupTitle) {
      return;
    }
    // Get stored data  --  do on load.
    // const storedData = await AsyncStorage.getItem("data");
    // const currentData: TimerList[] = await JSON.parse(storedData || "[]");

    // Create new entry
    const newTimerGroup: TimerGroup = {
      id: uuid(),
      name: timerGroupTitle,
      data: [
        { time: 5, desc: "hell" },
        { time: 9, desc: "this is a desc" },
        { time: 14, desc: "not again" },
      ],
    };

    console.log("cd", newTimerGroup);

    // Write to local storage
    AsyncStorage.setItem("data", JSON.stringify([...options, newTimerGroup]));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Timer Group</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.form}>
          <Text style={styles.label}>Group Name:</Text>
          <TextInput
            style={styles.input}
            onChangeText={updateTitle}
            placeholder="Timer group name"
          />
          <Spacer />
          <View style={styles.dataHeader}>
            <Text style={styles.label}>Timer Data:</Text>
            <TouchableOpacity style={styles.addData}>
              <FontAwesome name="plus" size={20} color="green" />
            </TouchableOpacity>
          </View>
          <DataInput />
          <DataInput />
          <DataInput />
        </View>
        <Spacer />
        <Button title="Add Timer Group" onPress={onAddTimerGroup} />
      </View>
      <View style={styles.footer}>
        <Footer />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flex: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "orange",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  body: {
    flex: 75,
    alignItems: "center",
    backgroundColor: "dodgerblue",
    paddingTop: 8,
  },
  form: {
    width: "90%",
    marginHorizontal: "auto",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 4,
  },
  input: {
    fontSize: 18,
    padding: 8,
    color: "black",
    backgroundColor: "white",
  },
  dataHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  addData: {
    width: "10%",
    height: 32,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  footer: {
    flex: 10,
    justifyContent: "center",
    backgroundColor: "orange",
  },
});
