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
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Footer } from "../components";

export const Admin: React.FC<Record<string, never>> = () => {
  const navigation = useNavigation<AdminScreenProp>();

  const [mode, setMode] = React.useState<Timer[] | null>(null);
  const [options, setOptions] = React.useState<TimerGroup[]>([]);
  // const [timerList, setTimerList] = React.useState<Timer[]>([]);

  const deleteItem = (id: number) => {};

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("data");
      const parsedJson = await JSON.parse(jsonValue || "[]");
      setOptions(await parsedJson);
      setMode((await parsedJson[0]?.data) || null);
    } catch (e) {
      console.log("Error Reading: ", e);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  const selectGroup = (id: string): void => {
    console.log(`ID: ${id} selected`);
  };

  const editGroup = (id: string): void => {
    navigation.navigate("AddEditTimerGroup", {
      id,
    });
    console.log(`Edit ID: ${id} selected`);
  };

  const deleteGroup = (id: string): void => {
    console.log(`Delete ID: ${id} selected`);
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
          data={options}
          renderItem={({ item }) => (
            <ListItem
              id={item.id}
              title={item.name}
              handleSelectGroup={(id) => selectGroup(id)}
              handleEditGroup={(id) => editGroup(id)}
              handleDeleteGroup={(id) => deleteGroup(id)}
            />
          )}
          keyExtractor={(item) => item.id}
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
