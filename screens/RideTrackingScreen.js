import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const MapDirections = ({ location }) => {
  const fetchLastDocument = async () => {
    try {
      const response = await axios.get(Api_URL_driver);

      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.detail || "Failed to fetch document"
        );
      }
      throw error;
    }
  };

  const infoDriver = fetchLastDocument();
  origin = infoDriver.origin;

  useEffect(() => {
    if (location) {
      console.log("Location updated:", location);
    }
  }, [location]);

  if (!location || !location.origin || !location.destination) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 45.5018869,
          longitude: -73.56739189999999,
          latitudeDelta: 0.008,
          longitudeDelta: 0.003,
        }}
      >
        <MapViewDirections
          origin={location.origin}
          destination={location.destination}
          apikey="AIzaSyCzlmUr9hg0E2elKzaHqr9eV-UuX4jOlBI"
          strokeWidth={4}
          strokeColor="#35c3f5"
          mode={"DRIVING"}
        />

        <Marker coordinate={location.origin} title="Starting Point" />
        <Marker coordinate={location.destination} title="Destination Point" />
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

export default MapDirections;
