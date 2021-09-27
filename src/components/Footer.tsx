import * as React from "react";
import { Button, Gap } from "../ui";
import { View, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FooterComponentProp, TimerGroup } from "../types";

interface FooterProps {
  fromAdmin?: boolean;
  timerGroup?: TimerGroup;
}

export const Footer = ({ timerGroup, fromAdmin }: FooterProps) => {
  const navigation = useNavigation<FooterComponentProp>();

  const naviateHome = () =>
    navigation.push("Home", timerGroup ? { timerGroup } : undefined);

  const navigateBack = () => navigation.pop();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button textContent="Home" handlePress={naviateHome} />
      <Gap width={12} />
      <Button
        textContent="Back"
        handlePress={fromAdmin ? naviateHome : navigateBack}
      />
    </View>
  );
};
