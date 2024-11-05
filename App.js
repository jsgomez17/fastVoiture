import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen"; // Pantalla de login
import FaceRecognitionScreen from "./screens/FaceRecognitionScreen"; //pantalla de faceRegnitions
import SignupScreen from "./screens/SignupScreen"; // Pantalla de inscripción
import Reservation from "./screens/Reservation"; // Pantalla de Reservation
import DestinationSelection from "./screens/DestinationSelection"; // Pantalla de direcciones
import ReservationLater from "./screens/ReservationLater"; // Pantalla de reservacion mas tarde

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: "Se connecter" }}
        />
        <Stack.Screen
          name="FaceRecognitionScreen"
          component={FaceRecognitionScreen}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{ title: "S'inscrire" }}
        />
        <Stack.Screen
          name="Reservation"
          component={Reservation}
          options={{ title: "Reservation" }}
        />
        <Stack.Screen
          name="DestinationSelection"
          component={DestinationSelection}
          options={{ title: "Destination Selection" }}
        />
        <Stack.Screen
          name="ReservationLater"
          component={ReservationLater}
          options={{ title: "Réservation plus tard" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
