import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MyRoutes from "./MyRoutes";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";

const Stack = createNativeStackNavigator();
let persistor = persistStore(store);

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_Bold: require("./assets/fonts/Montserrat-Bold.ttf"),
    Montserrat_Medium: require("./assets/fonts/Montserrat-Medium.ttf"),
    Montserrat_Regular: require("./assets/fonts/Montserrat-Regular.ttf"),
    Montserrat_Light: require("./assets/fonts/Montserrat-Light.ttf"),
  });
  if(!fontsLoaded){
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MyRoutes />
        </PersistGate>
      </ReduxProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
