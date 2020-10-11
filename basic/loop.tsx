import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  block,
  Clock,
  clockRunning,
  cond,
  Easing,
  eq,
  not,
  set,
  startClock,
  timing,
  useCode,
  Value
} from "react-native-reanimated";

const runTiming = (clock: Clock) => {
  const time = new Value(0);
  const finished = new Value(0);
  const position = new Value(0);
  const frameTime = new Value(0);
  const to = new Value(1);
  return block([
    cond(
      not(clockRunning(clock)),
      set(time, 0),
      timing(
        clock,
        {
          time,
          finished,
          position,
          frameTime,
        },
        {
          toValue: to,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }
      )
    ),
    cond(eq(finished, 1), [
      set(finished, 0),
      set(frameTime, 0),
      set(time, 0),
      set(to, not(position)),
    ]),
    position,
  ]);
};
const LoopingDot = () => {
  const clock = new Clock();
  const opacity = new Value(0);
  useEffect(() => {}, []);
  useCode(
    () => [
      cond(not(clockRunning(clock)), startClock(clock)),
      set(opacity, runTiming(clock)),
    ],
    []
  );
  return <Animated.View style={[styles.circle, { opacity }]}></Animated.View>;
};

const styles = StyleSheet.create({
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "red",
  },
});

export default LoopingDot;
