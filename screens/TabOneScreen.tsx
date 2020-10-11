import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Button, StyleSheet } from 'react-native';
import LoopingDot from "../basic/loop";
import { View } from '../components/Themed';

export default function TabOneScreen() {
  const { navigate } = useNavigation();
  return (
    <View style={styles.container}>
      <LoopingDot />
      <Button title="Image Swiper" onPress={() => navigate("ImageSwiper")} />
      <Button title="WhatsApp Gallery" onPress={() => navigate("WhatsApp")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
