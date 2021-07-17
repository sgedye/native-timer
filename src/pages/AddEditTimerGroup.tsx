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
  AddEditTimerGroupScreenProp,
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

interface AddEditTimerGroupProps {
  route: any;
  navigation: AddEditTimerGroupScreenProp;
}

export const AddEditTimerGroup: React.FC<AddEditTimerGroupProps> = ({
  route,
  navigation,
}) => {
  console.log("route", route);
  const routeId = route?.params?.id || null;

  const [timerGroup, setTimerGroup] = React.useState<TimerGroup | null>(null);
  const [timerGroupTitle, setTimerGroupTitle] = React.useState<string>("");
  const [options, setOptions] = React.useState<TimerGroup[]>([]);
  // const [newTimer, setNewTimer] = React.useState<TimerGroup | null>(null);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("data");
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

  React.useEffect(() => {
    console.log(routeId);
    console.log("opt len", options?.length);
    if (routeId && !!options?.length) {
      const editableGroup = options.find(({ id }) => id === routeId);
      if (editableGroup) {
        setTimerGroup(editableGroup);
        setTimerGroupTitle(editableGroup.name);
      }
    }
  }, [options]);

  const setTitle = (title: string) => setTimerGroupTitle(title);
  const setTime = () => {
    // Take an id and number and set the timer data event time.
  };

  const setDescription = () => {
    // Take an id and string and set the timer data event desc.
  };

  const onAddTimerGroup = async () => {
    if (!timerGroupTitle) {
      return;
    }

    if (!routeId) {
      // If routeId is nullish... then new entry... so create a new entry.
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
      AsyncStorage.setItem("data", JSON.stringify([...options, newTimerGroup]));
    } else {
      // If routeId is truthy... then editing an event... so just overwrite the event in storage.
      const filteredOptions = options.filter((option) => option.id !== routeId);

      // Write to local storage
      AsyncStorage.setItem(
        "data",
        JSON.stringify([...filteredOptions, timerGroup])
      );
    }
  };

  console.log(timerGroup);
  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Add/Edit {timerGroup?.name || "Timer Group"}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.form}>
          <Text style={styles.label}>Group Name:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(title) => setTitle(title)}
            value={timerGroupTitle || ""}
            placeholder="Timer group name"
          />
          <Spacer />
          <View style={styles.dataHeader}>
            <Text style={styles.label}>Timer Data:</Text>
            <TouchableOpacity style={styles.addData}>
              <FontAwesome name="plus" size={20} color="green" />
            </TouchableOpacity>
          </View>
          {timerGroup?.data?.length ? (
            timerGroup.data.map(({ time, desc }, idx) => (
              <DataInput
                key={idx}
                time={time}
                description={desc}
                handleSetTime={(time) => setTime()}
                handleSetDescription={(description) => setDescription()}
              />
            ))
          ) : (
            <DataInput
              handleSetTime={(time) => setTime()}
              handleSetDescription={(description) => setDescription()}
            />
          )}
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
