import React, { useCallback, useState } from "react";
import { StyleSheet, TextStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieIndicatorScrollView from "../components/LottieIndicatorScrollView";
import { Text, View } from "../components/Themed";

const ScrollItem: React.FC = () => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>Item</Text>
      <Text>Description</Text>
    </View>
  );
};

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const fetch = useCallback(() => {
    console.log("fetching... ");

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  return { fetch, loading };
};

const Screen: React.FC = () => {
  const { fetch, loading } = useFetch();
  const onRefresh = useCallback(() => {
    fetch();
  }, [fetch]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LottieIndicatorScrollView
        loading={loading}
        lottieSource={require("../lottiefiles/loading.json")}
        onRefresh={onRefresh}
      >
        <ScrollItem />
        <ScrollItem />
        <ScrollItem />
        <ScrollItem />
        <ScrollItem />
        <ScrollItem />
      </LottieIndicatorScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 8,
    borderBottomColor: "#6c6c6c",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 14,
  } as TextStyle,
});

export default Screen;
