import * as React from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

import {
  StyleSheet,
  Text,
  View,
  Animated,
  Button,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";

import { Spacer, Gap } from "./src/ui";

import bursts from "./src/data/bursts.json";

export default function App() {
  const [timerKey, setTimerKey] = React.useState<number>(0);
  const [counter, setCounter] = React.useState<number>(0);
  const [routine, setRoutine] = React.useState(bursts);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);

  const handleComplete = (): void | [boolean, number] => {
    let returnTuple;
    console.log("finished", counter, routine[counter].desc);
    setCounter((prev) => {
      if (prev < routine.length - 1) {
        returnTuple = [true, routine[prev + 1].time];
        return prev + 1;
      } else {
        setCounter(0);
        setIsPlaying(false);
        returnTuple = [false, 0];
        return 0;
      }
    });
    setTimerKey((prev) => prev + 1);
    return returnTuple;
  };

  const restart = () => {
    setCounter(0);
    setTimerKey((prev) => prev + 1);
    setIsPlaying(true);
  };

  let bgStyles;

  switch (routine[counter].desc) {
    case "Get ready...":
      bgStyles = { backgroundColor: "dodgerblue" };
      break;
    case "Rest":
      bgStyles = { backgroundColor: "#009e00" };
      break;
    default:
      bgStyles = { backgroundColor: "#ff5c5c" };
  }

  return (
    <SafeAreaView style={[styles.container, bgStyles]}>
      <ExpoStatusBar style="auto" />
      <View>
        {routine[counter].desc.split(" ").map((part, idx) => (
          <Text key={idx} style={styles.description}>
            {part}
          </Text>
        ))}
      </View>
      <Spacer />
      <CountdownCircleTimer
        key={timerKey}
        isPlaying={isPlaying}
        duration={routine[counter].time}
        // initialRemainingTime={5}
        colors={[
          ["#004777", 0.4],
          ["#F7B801", 0.4],
          ["#A30000", 0.2],
        ]}
        strokeWidth={18}
        strokeLinecap="round"
        trailColor="#11111155"
        trailStrokeWidth={12}
        onComplete={handleComplete}
      >
        {({ remainingTime, animatedColor }) => (
          <Animated.Text style={{ color: animatedColor, fontSize: 40 }}>
            {remainingTime}
          </Animated.Text>
        )}
      </CountdownCircleTimer>
      <Spacer />
      <View style={styles.flexRow}>
        <Button
          title={isPlaying ? "Pause" : "Play"}
          onPress={() => setIsPlaying((prev) => !prev)}
        />
        <Gap width={12} />
        <Button title="Restart" onPress={restart} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  flexRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  spacer: {
    height: 12,
  },
  rowSpacer: {
    width: 12,
  },
  description: {
    fontSize: 60,
    fontWeight: "bold",
    textAlign: "center",
  },
});
