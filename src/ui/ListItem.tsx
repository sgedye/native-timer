import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface ListItemProps {
  title: string;
}

export const ListItem: React.FC<ListItemProps> = ({ title }) => {
  return (
    <TouchableOpacity style={styles.listItem}>
      <View style={styles.listItemView}>
        <Text>{title}</Text>
        <FontAwesome name="remove" size={20} color="firebrick" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    padding: 15,
    backgroundColor: "lightgrey",
  },
  listItemView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
