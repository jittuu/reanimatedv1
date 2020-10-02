import LotteView from "lottie-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollViewProps, StyleSheet } from "react-native";
import Reanimated, {
  and,
  call,
  eq,
  Extrapolate,
  interpolate,
  onChange,
  SpringUtils,
  useCode
} from "react-native-reanimated";
import {
  onScrollEvent,
  spring,
  useValue
} from "react-native-redash/lib/module/v1";
import { View } from "../components/Themed";
import useNodeOnce from "../hooks/useNodeOnce";

const TRIGGER_HEIGHT = 100;
const INDICATOR_HEIGHT = 50;

interface LoadingHeaderProps {
  y: Reanimated.Node<number>;
  refreshing: boolean;
  source: string;
}
const LoadingHeader: React.FC<LoadingHeaderProps> = ({
  y,
  refreshing,
  source,
}) => {
  const height = interpolate(y, {
    inputRange: [-TRIGGER_HEIGHT, 0],
    outputRange: [TRIGGER_HEIGHT, refreshing ? INDICATOR_HEIGHT : 0],
    extrapolateRight: Extrapolate.EXTEND,
  });

  const opacity = interpolate(y, {
    inputRange: [-TRIGGER_HEIGHT, 0],
    outputRange: [1, refreshing ? 1 : 0],
  });

  const lottie = useRef<LotteView>(null);

  useEffect(() => {
    if (lottie.current) {
      if (refreshing) {
        lottie.current.play();
      } else {
        lottie.current.reset();
      }
    }
  }, [refreshing]);

  return (
    <Reanimated.View
      style={[
        styles.loadingContainer,
        {
          opacity,
          height,
        },
      ]}
    >
      <LotteView ref={lottie} source={source} />
    </Reanimated.View>
  );
};

type RefreshStatus = "none" | "refreshing" | "refreshing-done";

interface LottieIndicatorScrollViewProps extends ScrollViewProps {
  loading: boolean;
  onRefresh: () => void;
  lottieSource: string;
}

const LottieIndicatorScrollView: React.FC<LottieIndicatorScrollViewProps> = ({
  loading,
  onRefresh,
  lottieSource,
  children,
  style,
  ...props
}) => {
  const y = useValue<number>(0);

  const getY = useNodeOnce(y);
  const onRefreshCallback = useCallback(() => {
    (async () => {
      const nowY = await getY();
      if (nowY < -TRIGGER_HEIGHT && onRefresh && !loading) {
        onRefresh();
      }
    })();
  }, [onRefresh, loading]);

  const [refreshing, setRefreshing] = useState<RefreshStatus>("none");

  useEffect(() => {
    setRefreshing((prev) => {
      if (loading) {
        return "refreshing";
      }

      switch (prev) {
        case "refreshing":
          return "refreshing-done";
        default:
          return "none";
      }
    });
  }, [loading]);

  const paddingTop = spring({
    from: INDICATOR_HEIGHT,
    to: 0,
    config: SpringUtils.makeConfigFromBouncinessAndSpeed({
      ...SpringUtils.makeDefaultConfig(),
      bounciness: 0,
      speed: 16,
    }),
  });

  useCode(() => {
    if (refreshing === "refreshing-done") {
      return [
        onChange(
          paddingTop,
          and(
            eq(paddingTop, 0),
            call([], () => {
              setRefreshing("none");
            })
          )
        ),
      ];
    }

    return [];
  }, [refreshing]);

  return (
    <View style={[styles.container, style]}>
      <LoadingHeader y={y} refreshing={loading} source={lottieSource} />
      <Reanimated.ScrollView
        style={[
          StyleSheet.absoluteFill,
          {
            paddingTop:
              refreshing === "refreshing"
                ? INDICATOR_HEIGHT
                : refreshing === "refreshing-done"
                ? paddingTop
                : 0,
          },
        ]}
        {...props}
        scrollEventThrottle={1}
        onScroll={onScrollEvent({ y })}
        onResponderRelease={onRefreshCallback}
      >
        {children}
      </Reanimated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});

export default LottieIndicatorScrollView;
