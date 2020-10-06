import React, { useCallback } from "react";
import { Alert, Dimensions, Image, ImageStyle, StyleSheet, View } from "react-native";
import {
  PanGestureHandler,
  State,
  TouchableWithoutFeedback
} from "react-native-gesture-handler";
import Animated, {
  add,
  call,
  clockRunning,
  cond,
  divide,
  eq,
  floor,
  not,
  set,
  useCode
} from "react-native-reanimated";
import {
  snapPoint,
  timing,
  useClock,
  usePanGestureHandler,
  useValue
} from "react-native-redash/lib/module/v1";

const { width, height } = Dimensions.get("window");

export const assets = [
  require("./assets/3.jpg"),
  require("./assets/2.jpg"),
  require("./assets/4.jpg"),
  require("./assets/5.jpg"),
  require("./assets/1.jpg"),
];

const snapPoints = assets.map((_, i) => i * -width);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  pictures: {
    width: width * assets.length,
    height,
    flexDirection: "row",
  },
  picture: {
    width,
    height,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: 'contain'
  } as ImageStyle,
});

const Swiper = () => {
  const clock = useClock();
  const index = useValue(0);
  const offsetX = useValue(0);
  const translateX = useValue(0);
  const {
    gestureHandler,
    state,
    velocity,
    translation,
  } = usePanGestureHandler();
  const to = snapPoint(translateX, velocity.x, snapPoints);
  // render
  // if( state === State.ACTIVE) {
  //translateX  = offsetX + translation.x;
  // }
  useCode(
    () => [
      cond(eq(state, State.ACTIVE), [
        set(translateX, add(offsetX, translation.x)),
      ]),
      cond(eq(state, State.END), [
        set(translateX, timing({ clock, from: translateX, to })),
        set(offsetX, translateX),
        cond(not(clockRunning(clock)), [
          set(index, floor(divide(translateX, -width))),
          call([index], onChangeHandler)
        ]),
      ]),
    ],
    []
  );
  const onChangeHandler = useCallback((args: ReadonlyArray<number>) => {
    console.log("index: ", args[0]);
  }, []);
  return (
    <View style={styles.container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[styles.pictures, { transform: [{ translateX }] }]}
          >
            {assets.map((source) => (
              <TouchableWithoutFeedback onPress={() => Alert.prompt("hello")}>
                <View key={source} style={styles.picture}>
                  <Image style={styles.image} {...{ source }} />
                </View>
              </TouchableWithoutFeedback>
            ))}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Swiper;
