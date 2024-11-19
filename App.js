import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen"; // Pantalla de login
import SignupScreen from "./screens/SignupScreen"; // Pantalla de inscripción
import Reservation from "./screens/Reservation"; // Pantalla de Reservation
import DestinationSelection from "./screens/DestinationSelection"; // Pantalla de direcciones
import ReservationLater from "./screens/ReservationLater"; // Pantalla de reservacion mas tarde
import PaymentOptions from "./screens/PaymentOptions"; // Pantalla de pagos
import ReservationSuccess from "./screens/ReservationSuccess"; //pagina de resumen de la reserva
import UserModificationScreen from "./screens/UserModificationScreen"; // Pantalla de modificación de usuario
import CaptureFaceScreen from "./screens/CaptureFaceScreen";

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
          name="PaymentOptions"
          component={PaymentOptions}
          options={{ title: "Paiements" }}
        />
        <Stack.Screen
          name="ReservationSuccess"
          component={ReservationSuccess}
          options={{ title: "Confirmation de paiement" }}
        />
        <Stack.Screen
          name="ReservationLater"
          component={ReservationLater}
          options={{ title: "Réservation plus tard" }}
        />
        <Stack.Screen
          name="UserModificationScreen"
          component={UserModificationScreen}
          options={{ title: "Modifier l'utilisateur" }}
        />
        <Stack.Screen
          name="CaptureFaceScreen"
          component={CaptureFaceScreen}
          options={{ title: "Capture de Face" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
