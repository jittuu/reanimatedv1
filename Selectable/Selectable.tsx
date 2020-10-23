import React, { useCallback } from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import Animated, { cond, eq, set, useCode } from "react-native-reanimated";
import { spring, timing, useClock, useValue } from "react-native-redash/lib/module/v1";
import { View, ViewProps } from "../components/Themed";

const EXPAND_SCALE = 1.2;

interface SelectableProps extends ViewProps {
  selected?: boolean;
  onPress?: (selected: boolean) => void;
}
const Selectable: React.FC<SelectableProps> = ({
  selected,
  onPress,
  children,
}) => {
  const onPressX = useCallback(() => {
    onPress && onPress(!selected);
  }, [onPress, selected]);

  const sel = useValue(0);
  const scale = useValue(1);
  const clock = useClock();
  useCode(
    () => [
      set(sel, selected ? 1 : 0),
      cond(
        eq(sel, 1),
        set(scale, spring({ clock, from: scale, to: EXPAND_SCALE }))
      ),
      cond(eq(sel, 0), set(scale, timing({ clock, from: scale, to: 1 }))),
    ],
    [selected]
  );
  return (
    <TouchableWithoutFeedback onPress={onPressX}>
      <Animated.View
        style={[
          styles.container,
          {
            borderWidth: selected ? 1 : 0,
            borderColor: selected ? "red" : "#fff",
          },
          { transform: [{ scale }] },
        ]}
      >
        {children}
        {selected && <View style={styles.tag} />}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 30,
    width: 100,
    margin: 10,
    overflow: "hidden",
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "red",
    width: 20,
    height: 20,
    transform: [{ rotate: "45deg" }, { translateX: 16 }],
  },
});

export default Selectable;
