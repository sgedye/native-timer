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

import { AddEditTimerGroupScreenProp, Timer, TimerGroup } from "../types";
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
  const [options, setOptions] = React.useState<TimerGroup[]>([]);

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
        return setTimerGroup(editableGroup);
      }
    }
    // Always want to work with a timer group, so create one if it's add.
    setTimerGroup({
      id: uuid(),
      name: "",
      data: [],
    });
  }, [options]);

  const setTitle = (title: string) => {
    setTimerGroup(
      (prev) =>
        ({
          ...prev,
          name: title,
        } as TimerGroup)
    );
  };
  const setTime = () => {
    // Take an id and number and set the timer data event time.
  };

  const setDescription = () => {
    // id: string, description: string
    // Take an id and string and set the timer data event desc.
  };

  const onAddTimerGroup = async () => {
    if (!timerGroup!.name) {
      // Make an alert - please enter name
      return;
    }

    if (!timerGroup!.data[0].time || !timerGroup!.data[0].desc) {
      // Make an alert - please enter name and data.
      return;
    }

    // If routeId is null, add timerGroup to the list (new entry)
    if (!routeId) {
      AsyncStorage.setItem("data", JSON.stringify([...options, timerGroup]));
    }
    // If routeId is !null, timerGroup already exists, so replace it.
    else {
      const filteredOptions = options.filter((option) => option.id !== routeId);

      // Write to local storage
      AsyncStorage.setItem(
        "data",
        JSON.stringify([...filteredOptions, timerGroup])
      );
    }
  };

  const addDataRow = () => {
    const newId = uuid();
    setTimerGroup(
      (prev) =>
        ({
          ...prev,
          data: [...prev!.data, { id: newId, time: 5, desc: "" }],
        } as TimerGroup)
    );
    return (
      <DataInput
        handleSetTime={(time) => setTime()}
        handleSetDescription={(description) => setDescription()}
        handleDeleteRow={() => deleteDataRow(newId)}
      />
    );
  };

  const deleteDataRow = (id: string) => {
    setTimerGroup(
      (prev) =>
        ({
          ...prev,
          data: prev?.data.filter((el) => el.id !== id),
        } as TimerGroup)
    );
  };

  const persistChanges = () => {
    console.log("saving changes... naaaah, not really :P");
  };

  if (!timerGroup) {
    return null;
  }

  // Here timerGroup is always truthy, either edit with prefilled deets, or new with prefilled uuid.

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Add/Edit {timerGroup.name || "Timer Group"}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.form}>
          <Text style={styles.label}>Group Name:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(title) => setTitle(title)}
            value={timerGroup.name || ""}
            placeholder="Timer group name"
          />
          <Spacer />
          <View style={styles.dataHeader}>
            <Text style={styles.label}>Timer Data:</Text>
            <TouchableOpacity
              style={styles.addData}
              onPress={() => addDataRow()}
            >
              <FontAwesome name="plus" size={20} color="green" />
            </TouchableOpacity>
          </View>
          {timerGroup.data.map(({ id, time, desc }) => (
            <DataInput
              key={id}
              time={time}
              description={desc}
              handleSetTime={(time) => setTime()}
              handleSetDescription={(description) => setDescription()}
              handleDeleteRow={() => deleteDataRow(id)}
            />
          ))}
        </View>
        <Spacer />
        <Button title="Add Timer Group" onPress={onAddTimerGroup} />
        <Button title="Save Changes" onPress={persistChanges} />
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
