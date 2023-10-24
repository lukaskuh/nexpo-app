import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, ImageBackground, Text } from "react-native";
import { EMap, KarhusetMap, Map, SCMap, TentMap, FairMap } from "components/maps/MapProps";
import { View } from "components/Themed";
import { MapStackParamList } from "./MapNavigator";
import { ArkadButton } from "components/Buttons";
import Colors from "constants/Colors";

export type mapNavigation = {
  navigation: StackNavigationProp<MapStackParamList, "MapScreen">;
  map: Map;
};

export default function MapScreen({ navigation }: mapNavigation) {
  function openMap(map: Map) {
    navigation.navigate("ZoomMapScreen", { map });
  }
  
  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="contain"
        source={{ uri: FairMap.props.images[0].props.source }}
        defaultSource={FairMap.props.images[0].props.defaultSource}
        style={styles.image}
      >
        <ArkadButton
          style={styles.karbutton}
          onPress={() => openMap(KarhusetMap)}
        />
        <ArkadButton
          style={styles.studiebutton}
          onPress={() => openMap(SCMap)}
        />
        <ArkadButton 
          style={styles.ebutton} 
          onPress={() => openMap(EMap)} 
        />
        <ArkadButton 
          style={styles.tentbutton} 
          onPress={() => openMap(EMap)} 
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  scroller: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.arkadNavy,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    zIndex: 1,
    opacity: 1,
    position: "relative",
  },
  karbutton: {
    backgroundColor: Colors.arkadTurkos,
    position: "absolute",
    width: "50%",
    aspectRatio: 2.0,
    textAlign: "center",
    opacity: 0,
    borderRadius: 100,
    left: "11%",
    bottom: "63%",
    margin: 0,
    zIndex: 1000,
  },
  studiebutton: {
    backgroundColor: Colors.arkadSkog,
    position: "absolute",
    width: "40%",
    aspectRatio: 1.7,
    opacity: 0,
    borderRadius: 100,
    textAlign: "center",
    margin: "0%",
    left: "11%",
    bottom: "48%",
    zIndex: 1000,
  },
  ebutton: {
    backgroundColor: Colors.arkadOrange,
    position: "absolute",
    width: "52%",
    aspectRatio: 1.6,
    opacity: 0,
    textAlign: "center",
    margin: 0,
    left: "47%",
    bottom: "37%",
    borderRadius: 100,
    zIndex: 1000,
  },
  tentbutton: {
    backgroundColor: Colors.arkadNavy,
    position: "absolute",
    width: "40%",
    aspectRatio: 1.7,
    opacity: 0,
    borderRadius: 100,
    textAlign: "center",
    margin: "0%",
    left: "13%",
    bottom: "29%",
    zIndex: 1000,
  },
});
