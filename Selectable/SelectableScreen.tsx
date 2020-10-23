import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Text, View } from "../components/Themed";
import Selectable from "./Selectable";

const Screen: React.FC = () => {
  const [data, setData] = useState(
    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
      id: i,
      text: `Hello ${i}`,
      selected: false,
    }))
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        {data.map((d) => (
          <Selectable
            key={d.id}
            selected={d.selected}
            onPress={(s) => {
              setData((prev) => {
                const rest = prev
                  .filter((pv) => pv.id !== d.id)
                  .map((pv) => ({ ...pv, selected: false }));
                return [{ ...d, selected: s }, ...rest].sort(
                  (a, b) => a.id - b.id
                );
              });
            }}
          >
            <Text>{d.text}</Text>
          </Selectable>
        ))}
      </ScrollView>
    </View>
  );
};

export default Screen;
