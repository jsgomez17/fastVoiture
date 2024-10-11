import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Reservation = ({ route }) => {
  // Extraemos los datos pasados desde la pantalla de inicio de sesión
  const { nom, prenom } = route.params;
  console.log(
    "Recibiendo en ReservationScreen: nom =",
    nom,
    ", prenom =",
    prenom
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faire une réservation</Text>
      <Text style={styles.welcomeText}>
        Bienvenue, {nom} {prenom}
      </Text>
      {/* Aquí puedes añadir más componentes relacionados con la reserva */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default Reservation;
