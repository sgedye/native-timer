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
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { FontAwesome } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import { Gap, ListItem, Spacer } from "../ui";
import { Footer } from "../components";

import { AdminScreenProp, TimerGroup } from "../types";
import seedData from "../data/data.json";

interface AdminProps {
  route?: any;
}

export const Admin: React.FC<AdminProps> = ({ route }) => {
  const routeData: TimerGroup[] = route?.params?.data || seedData;

  const navigation = useNavigation<AdminScreenProp>();
  const [data, setData] = useAsyncStorage<TimerGroup[]>(
    "sg_timer_data",
    routeData
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
    if (data.length > 1) {
      setData((prev) => prev.filter((group) => group.timerGroupId !== groupId));
    } else {
      Toast.show({
        type: "error",
        text1: "You must have at least one timer group.",
      });
    }
  };

  const confirmDeleteAll = () => {
    Alert.alert(
      "Are you sure?",
      "This will delete all timer data from your phone.",
      [
        {
          text: "Cancel",
        },
        {
          text: "Delete All",
          onPress: clearStorage,
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear().then(() => {
        setData((prev) =>
          prev.filter(
            (group) => group.timerGroupId === "seed-data-timer-group-0"
          )
        );
      });
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Oops, something went wrong",
        "We are unable to clear storage at this time. Please try again later."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Select Timer Group</Text>
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
        <TouchableOpacity onPress={confirmDeleteAll} style={styles.addButton}>
          <Text style={styles.addButtonText}>Clear Storage</Text>
        </TouchableOpacity>
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
