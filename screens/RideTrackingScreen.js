import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const RideTrackingScreen = ({ route }) => {
  const { userLocation, driverLocation } = route.params; // Recibe las ubicaciones desde la navegación

  const [location, setLocation] = useState({
    user: userLocation,
    driver: driverLocation,
  });

  useEffect(() => {
    const updateDriverLocation = (newDriverLocation) => {
      setLocation((prevState) => ({
        ...prevState,
        driver: newDriverLocation,
      }));
    };

    // Aquí deberías agregar la lógica para recibir actualizaciones de la ubicación del conductor
    // Por ejemplo, usando WebSocket o algún otro método para recibir la ubicación en tiempo real

    // Simulación de actualización de ubicación del conductor (reemplaza esto con tu lógica)
    const interval = setInterval(() => {
      const newDriverLocation = {
        latitude: location.driver.latitude + 0.0001, // Simulación de movimiento
        longitude: location.driver.longitude + 0.0001,
      };
      updateDriverLocation(newDriverLocation);
    }, 5000); // Actualiza cada 5 segundos

    return () => clearInterval(interval); // Limpieza del intervalo al desmontar el componente
  }, [location.driver]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.user.latitude,
          longitude: location.user.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={location.user}
          title="Tu ubicación"
          description="Aquí estás tú"
        />
        <Marker
          coordinate={location.driver}
          title="Ubicación del conductor"
          description="Aquí está tu conductor"
        />
      </MapView>
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
});

export default RideTrackingScreen;
