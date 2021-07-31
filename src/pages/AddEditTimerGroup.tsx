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
import { TextInput } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { FontAwesome } from "@expo/vector-icons";

import { useAsyncStorage } from "../hooks/useAsyncStorage";
import { Footer } from "../components";
import { DataInput, Spacer } from "../ui";

import { AddEditTimerGroupScreenProp, TimerGroup } from "../types";
import seedData from "../data/data.json";

interface AddEditTimerGroupProps {
  route: any;
  navigation: AddEditTimerGroupScreenProp;
}

export const AddEditTimerGroup: React.FC<AddEditTimerGroupProps> = ({
  route,
  navigation,
}) => {
  const routeId: string = route?.params?.groupId;

  const [data, setData] = useAsyncStorage<TimerGroup[]>(
    "sg_timer_data",
    seedData
  );

  const [timerGroup, setTimerGroup] = React.useState<TimerGroup | null>(null);
  const [isListSaved, setListSaved] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!!data.length && routeId) {
      const currentGroup = data.find(
        ({ timerGroupId }) => timerGroupId === routeId
      );
      if (currentGroup) {
        return setTimerGroup(currentGroup);
      }
    }

    // Always want to work with a timer group, so create one if it's add timer group.
    setTimerGroup({
      timerGroupId: uuid(),
      timerGroupName: "",
      timers: [
        {
          timerId: "sg-default-timer-group-timer-id",
          time: 5,
          desc: "",
        },
      ],
    });
  }, [data, routeId]);

  // Post new data back to admin, if list is saved.
  React.useEffect(() => {
    if (isListSaved) {
      return navigation.navigate("Admin", { data });
    }
  }, [isListSaved]);

  if (!timerGroup) {
    return null;
  }

  // Here timerGroup is always truthy, either edit with prefilled deets, or new with prefilled uuid.

  const setTitle = (title: string) => {
    setTimerGroup(
      (prev) =>
        ({
          ...prev,
          timerGroupName: title,
        } as TimerGroup)
    );
  };

  const updateTimer = (timerId: string, time: number, desc: string) => {
    const newTimers = timerGroup.timers.map((timer) => {
      if (timer.timerId === timerId) {
        return { ...timer, time, desc };
      }
      return timer;
    });
    setTimerGroup((prev) => ({ ...prev, timers: newTimers } as TimerGroup));
  };

  const addDataRow = () => {
    const newId = uuid();
    setTimerGroup(
      (prev) =>
        ({
          ...prev,
          timers: [...prev!.timers, { timerId: newId, time: 5, desc: "" }],
        } as TimerGroup)
    );
    return (
      <DataInput
        handleUpdateTimer={(time, desc) => updateTimer(newId, time, desc)}
        handleDeleteTimer={() => deleteDataRow(newId)}
      />
    );
  };

  const deleteDataRow = (id: string) => {
    if (timerGroup.timers.length > 1) {
      setTimerGroup(
        (prev) =>
          ({
            ...prev,
            timers: prev!.timers.filter((el) => el.timerId !== id),
          } as TimerGroup)
      );
    } else {
      Toast.show({
        type: "error",
        text1: "Timer groups must have at least 1 timer.",
      });
    }
  };

  const isNewTimerGroup = !data.find(
    ({ timerGroupId }) => timerGroupId === timerGroup.timerGroupId
  );

  const persistChanges = () => {
    if (!timerGroup.timerGroupName) {
      return Toast.show({
        type: "error",
        text1: "Please enter a timer group name.",
      });
    }

    if (timerGroup.timers.some((timer) => !!timer.time === false)) {
      return Toast.show({
        type: "error",
        text1: "All timers must have a valid duration.",
      });
    }

    if (timerGroup.timers.some((timer) => timer.desc === "")) {
      return Toast.show({
        type: "error",
        text1: "All timers must have a valid description.",
      });
    }

    // Add new timerGroup - if timerGroupId not in data list.
    if (isNewTimerGroup) {
      setData((prev) => [...prev, timerGroup]);
      return setListSaved(true);
    }

    // Update existing
    const tempList = data.map((groupTimer) => {
      if (groupTimer.timerGroupId === timerGroup.timerGroupId) {
        return {
          ...groupTimer,
          timerGroupName: timerGroup.timerGroupName,
          timers: timerGroup.timers,
        };
      }
      return groupTimer;
    });
    setData(tempList);
    return setListSaved(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {isNewTimerGroup
            ? "Add New Timer Group"
            : `Edit ${timerGroup.timerGroupName}`}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.form}>
          <Text style={styles.label}>Group Name:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(title) => setTitle(title)}
            value={timerGroup.timerGroupName || ""}
            placeholder="Timer group name"
          />
          <Spacer />
          <View style={styles.dataHeader}>
            <Text style={styles.label}>Timer Data:</Text>
            <TouchableOpacity style={styles.addData} onPress={addDataRow}>
              <FontAwesome name="plus" size={20} color="green" />
            </TouchableOpacity>
          </View>
          {timerGroup.timers.map(({ timerId, time, desc }) => (
            <DataInput
              key={timerId}
              time={time}
              description={desc}
              handleUpdateTimer={(time, desc) =>
                updateTimer(timerId, time, desc)
              }
              handleDeleteTimer={() => deleteDataRow(timerId)}
            />
          ))}
        </View>
        <Spacer />
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
