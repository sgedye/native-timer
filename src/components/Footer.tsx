import * as React from "react";
import { Button, Gap } from "../ui";
import { View, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FooterComponentProp } from "../types";

export const Footer: React.FC<Record<string, never>> = () => {
  const navigation = useNavigation<FooterComponentProp>();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        textContent="Home"
        handlePress={() => navigation.navigate("Home")}
      />
      <Gap width={12} />
      <Button handlePress={() => navigation.pop()} textContent="Back" />
    </View>
  );
};
