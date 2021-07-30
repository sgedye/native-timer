import * as React from "react";
import { Audio } from "expo-av";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import { useNavigation } from "@react-navigation/native";
import { HomeScreenProp, Timer, TimerGroup } from "../types";

import {
  StyleSheet,
  Text,
  View,
  Animated,
  SafeAreaView,
  StatusBar,
  Platform,
  Button as RNButton,
} from "react-native";

import { Spacer, Gap, Button } from "../ui";

import seedData from "../data/data.json";
import toneAudio from "../assets/tone.mp3";
import tadaAudio from "../assets/tada.mp3";

interface HomeProps {
  route?: any;
}

export const Home: React.FC<HomeProps> = ({ route }) => {
  const timerGroup: TimerGroup = route?.params?.timerGroup || seedData[0];

  const [timerKey, setTimerKey] = React.useState<number>(0);
  const [counter, setCounter] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [hasStarted, setHasStarted] = React.useState<boolean>(false);
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);

  const navigation = useNavigation<HomeScreenProp>();

  // React.useEffect(() => {
  //   return sound
  //     ? () => {
  //         console.log("Unloading Sound");
  //         sound.unloadAsync();
  //       }
  //     : undefined;
  // }, [sound]);

  if (!timerGroup?.timers.length) {
    return (
      <>
        <Text>
          Error, either timerGroup is falsy... or more likely... the timers
          array is empty.
        </Text>
        <RNButton
          title="Go to the admin"
          onPress={() => navigation.navigate("Admin")}
        />
      </>
    );
  }

  const handleComplete = (): void | [boolean, number] => {
    let returnTuple;
    setCounter((prev) => {
      if (prev < timerGroup.timers.length - 1) {
        playSound();
        setTimerKey((prev) => prev + 1);
        returnTuple = [true, timerGroup.timers[prev + 1].time];
        return prev + 1;
      } else {
        restart();
        playSound(true);
        returnTuple = [false, 0];
        return 0;
      }
    });
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

  async function playSound(lastTimer = false) {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      lastTimer ? tadaAudio : toneAudio
    );
    setSound(sound);

    await sound.playAsync();
  }

  const bgStyles =
    timerGroup.timers[counter]?.desc === "Get ready..."
      ? { backgroundColor: "dodgerblue" }
      : timerGroup.timers[counter]?.desc === "Rest"
      ? { backgroundColor: "#009e00" }
      : { backgroundColor: "#ff5c5c" };

  return (
    <SafeAreaView style={[styles.container, bgStyles]}>
      <ExpoStatusBar style="auto" />
      <View style={styles.section35}>
        <CountdownCircleTimer
          key={timerKey}
          isPlaying={isPlaying}
          duration={timerGroup.timers[counter].time}
          colors={[
            ["#004777", 0.3],
            ["#009e00", 0.3],
            ["#F7B801", 0.2],
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
      <View style={styles.section50}>
        {hasStarted ? (
          timerGroup.timers[counter].desc.split(" ").map((part, idx) => (
            <View key={idx}>
              <Text style={styles.description}>{part}</Text>
              {part === "Rest" && (
                <>
                  <Spacer />
                  <Text style={styles.nextUp}>Next up:</Text>
                  <Spacer height={4} />
                  <Text style={[styles.nextUp, { fontWeight: "bold" }]}>
                    {timerGroup.timers[counter + 1]?.desc}
                  </Text>
                </>
              )}
            </View>
          ))
        ) : (
          <RNButton
            title="Go to Details"
            onPress={() => navigation.navigate("Admin")}
          />
        )}
      </View>
      <View style={[styles.section15, styles.flexRow]}>
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
          <>
            <Button
              textContent={isPlaying ? "Pause" : "Play"}
              handlePress={playPause}
              btnSize="lg"
              backgroundColor="darkgreen"
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  section15: {
    flex: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  section35: {
    flex: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  section50: {
    flex: 50,
    alignItems: "center",
    justifyContent: "center",
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
  nextUp: {
    fontSize: 30,
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
});
