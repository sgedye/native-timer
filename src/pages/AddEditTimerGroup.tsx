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
  Dimensions,
  FlatList,
} from "react-native";
import { v4 as uuid } from "uuid";
import { TextInput } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { FontAwesome } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import { Footer } from "../components";
import { DataInput, Spacer } from "../ui";

import { AddEditTimerGroupScreenProp, TimerGroup, Timer } from "../types";
import seedData from "../data/data.json";

interface AddEditTimerGroupProps {
  route?: any;
  selectedTimerId: string;
}

export const AddEditTimerGroup = ({
  route,
  selectedTimerId,
}: AddEditTimerGroupProps) => {
  const routeId: string = route?.params?.groupId;
  const navigation = useNavigation<AddEditTimerGroupScreenProp>();

  const [data, setData] = useAsyncStorage<TimerGroup[]>(
    "sg_timer_data",
    seedData
  );

  const [timerGroup, setTimerGroup] = React.useState<TimerGroup | null>(null);

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
          timerId: uuid(),
          time: 5,
          desc: "",
        },
      ],
    });
  }, [data, routeId]);

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
    // ERROR - No timer group name
    if (!timerGroup.timerGroupName) {
      return Toast.show({
        type: "error",
        text1: "Please enter a timer group name.",
      });
    }

    // ERROR - One or more timers have an invalid description
    if (timerGroup.timers.some((timer) => timer.desc === "")) {
      return Toast.show({
        type: "error",
        text1: "All timers must have a valid description.",
      });
    }

    // ERROR - One or more timers have an invalid duration
    if (timerGroup.timers.some((timer) => !!timer.time === false)) {
      return Toast.show({
        type: "error",
        text1: "All timers must have a valid duration.",
      });
    }

    // SUCCESS - Add new timerGroup - if timerGroupId not in data list.
    if (isNewTimerGroup) {
      setData((prev) => [...prev, timerGroup]);
      Toast.show({
        type: "success",
        text1: `${timerGroup.timerGroupName} has been successfully added.`,
      });
      return navigation.push("Admin", { data });
    }

    // SUCCESS - Update existing
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
    Toast.show({
      type: "success",
      text1: `${timerGroup.timerGroupName} has been successfully updated.`,
    });
    return navigation.push("Admin", { data });
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
        <FlatList
          ListHeaderComponent={
            <>
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
            </>
          }
          data={timerGroup.timers}
          renderItem={({ item }) => {
            const { timerId, time, desc } = item;
            return (
              <DataInput
                key={timerId}
                time={time}
                description={desc}
                handleUpdateTimer={(time, desc) =>
                  updateTimer(timerId, time, desc)
                }
                handleDeleteTimer={() => deleteDataRow(timerId)}
              />
            );
          }}
          keyExtractor={(timer: Timer) => timer.timerId}
          ListFooterComponent={
            <>
              <Spacer />
              <Button
                title="Save Changes"
                onPress={persistChanges}
                color="green"
              />
              <Spacer height={16} />
            </>
          }
        />
      </View>
      <View style={styles.footer}>
        <Footer
          timerGroup={data.find(
            ({ timerGroupId }) => timerGroupId === selectedTimerId
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get("window").height,
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
