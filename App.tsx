import * as React from "react";
import { Audio } from "expo-av";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

import {
  StyleSheet,
  Text,
  View,
  Animated,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";

import { Spacer, Gap, Button } from "./src/ui";

import bursts from "./src/data/bursts.json";

export default function App() {
  const [timerKey, setTimerKey] = React.useState<number>(0);
  const [counter, setCounter] = React.useState<number>(0);
  const [routine, setRoutine] = React.useState(bursts);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
  const [hasStarted, setHasStarted] = React.useState<boolean>(false);
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);

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
    playSound();
    setTimerKey((prev) => prev + 1);
    return returnTuple;
  };

  const playPause = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    setIsPlaying((prev) => !prev);
  };

  const restart = () => {
    setCounter(0);
    setTimerKey((prev) => prev + 1);
    setIsPlaying(false);
    setHasStarted(false);
  };

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("./src/assets/tone.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const bgStyles =
    routine[counter]?.desc === "Get ready..."
      ? { backgroundColor: "dodgerblue" }
      : routine[counter]?.desc === "Rest"
      ? { backgroundColor: "#009e00" }
      : { backgroundColor: "#ff5c5c" };

  return (
    <SafeAreaView style={[styles.container, bgStyles]}>
      <View style={styles.h35}>
        <CountdownCircleTimer
          key={timerKey}
          isPlaying={isPlaying}
          duration={routine[counter].time}
          colors={[
            ["#004777", 0.4],
            ["#F7B801", 0.4],
            ["#A30000", 0.2],
          ]}
          strokeWidth={15}
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
      </View>
      <View style={styles.h50}>
        {hasStarted &&
          routine[counter].desc.split(" ").map((part, idx) => (
            <Text key={idx} style={styles.description}>
              {part}
            </Text>
          ))}
      </View>
      <View style={[styles.h15, styles.flexRow]}>
        {hasStarted ? (
          <>
            <Button
              textContent={isPlaying ? "Pause" : "Play"}
              handlePress={playPause}
              btnSize="lg"
            />
            <Gap width={12} />
            <Button handlePress={restart} textContent="Reset" btnSize="lg" />
          </>
        ) : (
          <Button
            textContent={isPlaying ? "Pause" : "Play"}
            handlePress={playPause}
            btnSize="lg"
            backgroundColor="darkgreen"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  description: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  h15: {
    flex: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  h35: {
    flex: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  h50: {
    flex: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
