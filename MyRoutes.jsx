import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/Screens/LoginScreen";
import SingupScreen from "./src/Screens/SingupScreen";
import HomeScreen from "./src/Screens/HomeScreen";
import AddCar from "./src/Screens/AddCar";
import DetailScreen from "./src/Screens/DetailScreen"
import UserCars from "./src/Screens/UserCars";
import Profile from "./src/Screens/Profile";
import CarComparisonScreen from "./src/Screens/CarComparisonScreen";
import { useUserState } from "./src/Slices/userSlice";

const Stack = createNativeStackNavigator();

const MyRoutes = () => {
  const userState = useUserState()
  const initialRouteName = userState.id ? "Home" : "Login";

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SingUp" component={SingupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddCar" component={AddCar} />
        <Stack.Screen name="Detail" component={DetailScreen} 
          options = {{
            headerShown: true,
            headerTitle: "Car Details",
            headerTitleStyle: {
              fontSize: 26,
              fontWeight: "bold",
              marginBottom: 20,
              marginTop: 80,
              textAlign: "center",
            },
          }}
        />
        <Stack.Screen name="userCars" component={UserCars} 
          options = {{
            headerShown: true,
            headerTitle: "Your Cars",
            headerTitleStyle: {
              fontSize: 26,
              fontWeight: "bold",
              marginBottom: 20,
              marginTop: 80,
              textAlign: "center",
            },
          }}
        />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="compare" component={CarComparisonScreen} 
          options = {{
            headerShown: true,
            headerTitle: "Compare Cars",
            headerTitleStyle: {
              fontSize: 26,
              fontWeight: "bold",
              marginBottom: 20,
              marginTop: 80,
              textAlign: "center",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyRoutes;

const styles = StyleSheet.create({});
