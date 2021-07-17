import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface ListItemProps {
  id: string;
  title: string;
  handleSelectGroup: (id: string) => void;
  handleEditGroup: (id: string) => void;
  handleDeleteGroup: (id: string) => void;
}

export const ListItem: React.FC<ListItemProps> = ({
  id,
  title,
  handleSelectGroup,
  handleEditGroup,
  handleDeleteGroup,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => handleSelectGroup(id)}
      >
        <View style={styles.listItemView}>
          <Text>{title}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleEditGroup(id)}
      >
        <View style={styles.listItemView}>
          <FontAwesome name="edit" size={20} color="dodgerblue" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleDeleteGroup(id)}
      >
        <View style={styles.listItemView}>
          <FontAwesome name="remove" size={20} color="firebrick" />
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
    backgroundColor: "lightgrey",
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
