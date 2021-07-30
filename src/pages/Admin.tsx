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
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { AdminScreenProp, Timer, TimerGroup } from "../types";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { FontAwesome } from "@expo/vector-icons";

import { Gap, ListItem, Spacer } from "../ui";
import { Footer } from "../components";

import seedData from "../data/data.json";
import { useAsyncStorage } from "../hooks/useAsyncStorage";

export const Admin: React.FC<Record<string, never>> = () => {
  const navigation = useNavigation<AdminScreenProp>();
  const [data, setData] = useAsyncStorage<TimerGroup[]>(
    "sg_timer_data",
    seedData
  );

  const selectGroup = (groupId: string): void => {
    const timerGroup = data.find(
      ({ timerGroupId }) => timerGroupId === groupId
    );

    return navigation.navigate("Home", timerGroup ? { timerGroup } : undefined);
  };

  const editGroup = (groupId: string): void => {
    navigation.navigate("AddEditTimerGroup", {
      groupId,
    });
  };

  const deleteGroup = (groupId: string): void => {
    console.log(`Delete ID: ${groupId} selected`);
    setData((prev) => prev.filter((group) => group.timerGroupId !== groupId));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Select a new timer group</Text>
      </View>
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.push("AddEditTimerGroup")}
        >
          <FontAwesome
            name="plus"
            color="dodgerblue"
            size={22}
            style={{ marginTop: 4 }}
          />
          <Gap width={4} />
          <Text style={styles.addButtonText}>Add Group</Text>
        </TouchableOpacity>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ListItem
              title={item.timerGroupName}
              handleSelectGroup={() => selectGroup(item.timerGroupId)}
              handleEditGroup={() => editGroup(item.timerGroupId)}
              handleDeleteGroup={() => deleteGroup(item.timerGroupId)}
            />
          )}
          keyExtractor={(item) => item.timerGroupId}
        />
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
    backgroundColor: "dodgerblue",
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  addButtonText: {
    fontSize: 28,
    lineHeight: 50,
  },
  footer: {
    flex: 10,
    justifyContent: "center",
    backgroundColor: "orange",
  },
});
