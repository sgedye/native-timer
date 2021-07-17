import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Gap } from ".";

interface DataInputProps {
  time?: number | string;
  description?: string;
  handleSetTime: (time: string) => void;
  handleSetDescription: (description: string) => void;
  handleDeleteRow: () => void;
}

export const DataInput: React.FC<DataInputProps> = ({
  time = 5,
  description,
  handleSetTime,
  handleSetDescription,
  handleDeleteRow,
}) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <View style={styles.col20}>
        <TextInput
          style={styles.input}
          placeholder="Time"
          value={`${time}`}
          onChangeText={(time) => handleSetTime(time)}
        ></TextInput>
      </View>
      <View style={styles.col65}>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={(description) => handleSetDescription(description)}
        ></TextInput>
      </View>
      <TouchableOpacity style={styles.col10} onPress={handleDeleteRow}>
        <FontAwesome name="remove" size={20} color="firebrick" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  col20: {
    width: "20%",
  },
  col65: {
    width: "65%",
  },
  col10: {
    width: "10%",
    height: 32,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 32,
    fontSize: 18,
    paddingHorizontal: 8,
    color: "black",
    backgroundColor: "white",
  },
});
