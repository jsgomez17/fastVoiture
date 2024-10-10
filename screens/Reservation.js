import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Reservation = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faire une réservation</Text>
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
});

export default Reservation;
