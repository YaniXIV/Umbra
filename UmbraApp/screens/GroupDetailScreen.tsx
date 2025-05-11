import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupDetail'>;

export default function GroupDetailScreen({ route }: Props) {
  const { groupId } = route.params;
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const handleProve = () => {
    // TODO: Add backend interaction logic
    console.log('Prove button pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group ID: {groupId}</Text>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
          />
          <Circle
            center={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            radius={500}
            strokeColor="rgba(0,0,255,0.5)"
            fillColor="rgba(0,0,255,0.1)"
          />
        </MapView>
      )}
      <Button title="Prove" onPress={handleProve} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
  },
  map: {
    width: Dimensions.get('window').width - 32,
    height: 300,
    marginBottom: 16,
  },
});

