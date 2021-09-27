import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface ListItemProps {
  id: string;
  title: string;
  isSelectedTimer: boolean;
  handleSelectGroup: () => void;
  handleEditGroup: () => void;
  handleDeleteGroup: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({
  id,
  title,
  isSelectedTimer,
  handleSelectGroup,
  handleEditGroup,
  handleDeleteGroup,
}) => {
  const isDisabled = id === "seed-data-timer-group-0";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.listItem,
          { backgroundColor: isSelectedTimer ? "lightgreen" : "lightgrey" },
        ]}
        onPress={handleSelectGroup}
      >
        <View style={styles.listItemView}>
          <Text>{title}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleEditGroup}>
        <View style={styles.listItemView}>
          <FontAwesome name="edit" size={20} color="dodgerblue" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleDeleteGroup}
        disabled={isDisabled}
      >
        <View style={styles.listItemView}>
          <FontAwesome
            name="remove"
            size={20}
            color={isDisabled ? "grey" : "firebrick"}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  listItem: {
    flexGrow: 1,
    padding: 15,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
  listItemView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 15,
    borderColor: "grey",
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: "lightgrey",
  },
});
