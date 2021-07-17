import * as React from "react";
import { View } from "react-native";

export const Spacer: React.FC<{ height?: number }> = ({ height = 8 }) => (
  <View style={{ marginVertical: height }} />
);

export const Gap: React.FC<{ width?: number }> = ({ width = 8 }) => (
  <View style={{ marginHorizontal: width }} />
);
