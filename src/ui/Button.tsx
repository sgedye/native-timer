import React from "react";
import {
  StyleSheet,
  // TouchableNativeFeedback,
  Text,
  Pressable,
} from "react-native";

interface ButtonProps {
  btnSize?: "sm" | "md" | "lg";
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  color?: string;
  disabled?: boolean;
  textContent: string;
  handlePress: () => void;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  btnSize = "md",
  backgroundColor = "black",
  borderWidth,
  borderColor,
  borderRadius = 8,
  color = "white",
  disabled,
  textContent,
  handlePress,
  children,
}) => {
  const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: btnSize === "sm" ? 8 : btnSize === "lg" ? 18 : 12,
      paddingHorizontal: btnSize === "sm" ? 20 : btnSize === "lg" ? 40 : 32,
      backgroundColor,
      borderWidth,
      borderColor,
      borderRadius,
      elevation: 3,
    },
    buttonText: {
      color,
      fontWeight: "bold",
      letterSpacing: 0.25,
      fontSize: btnSize === "sm" ? 12 : btnSize === "lg" ? 24 : 16,
      lineHeight: btnSize === "sm" ? 15 : btnSize === "lg" ? 28 : 21,
    },
  });

  return (
    <Pressable onPress={handlePress} style={styles.button} disabled={disabled}>
      {children ? (
        children
      ) : (
        <Text style={styles.buttonText}>{textContent}</Text>
      )}
    </Pressable>
  );
};
