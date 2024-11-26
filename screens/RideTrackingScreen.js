// screens/RideTrackingScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import carIcon from "../public/assets/car-icon.png"; // Asegúrate de tener un icono de coche en esta ruta

const RideTrackingScreen = () => {
  const [driverLocation, setDriverLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  const passengerLocation = {
    latitude: 45.5017,
    longitude: -73.5673,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulación de movimiento del conductor
      setDriverLocation((prevLocation) => ({
        latitude: prevLocation.latitude + 0.0001,
        longitude: prevLocation.longitude + 0.0001,
      }));
    }, 1000); // Actualiza la posición cada segundo

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker coordinate={driverLocation}>
          <Image source={carIcon} style={styles.carIcon} />
        </Marker>
        <Marker coordinate={passengerLocation} pinColor="blue" />
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Conductor en camino...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  carIcon: {
    width: 30,
    height: 30,
  },
  infoContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RideTrackingScreen;
