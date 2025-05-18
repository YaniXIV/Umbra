import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import MapView, { Marker, Circle } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as Location from 'expo-location';
import { AddGroup } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateGroup'>;

interface GroupMember {
  username: string;
}

export default function CreateGroupScreen({ navigation }: Props) {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [newMember, setNewMember] = useState('');
  const [radius, setRadius] = useState('1000'); // Default 1km
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Get current location when component mounts
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleAddMember = () => {
    if (newMember.trim()) {
      setMembers([...members, { username: newMember.trim() }]);
      setNewMember('');
    }
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !location) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    try {
      // TODO: Implement API call to create group
      const groupData = {
        name: groupName,
        members: members.map(m => m.username),
        location: {
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
        },
        radius: parseInt(radius),
      };
      const result = await AddGroup(groupData)
      if (!result){
        console.log("Idk dude, the thingy didnt work bruh.")
      }

      
      console.log('Creating group:', groupData);
      // After successful creation, navigate back to group list
      navigation.goBack();
    } catch (error) {
      setErrorMsg('Failed to create group. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <TextInput
          label="Group Name"
          value={groupName}
          onChangeText={setGroupName}
          style={styles.input}
        />

        <View style={styles.memberSection}>
          <Text variant="titleMedium">Add Members</Text>
          <View style={styles.memberInput}>
            <TextInput
              label="Username"
              value={newMember}
              onChangeText={setNewMember}
              style={styles.memberInputField}
            />
            <Button mode="contained" onPress={handleAddMember} style={styles.addButton}>
              Add
            </Button>
          </View>
          
          {members.map((member, index) => (
            <View key={index} style={styles.memberItem}>
              <Text>{member.username}</Text>
              <Button onPress={() => handleRemoveMember(index)}>Remove</Button>
            </View>
          ))}
        </View>

        <View style={styles.mapContainer}>
          <Text variant="titleMedium">Select Location</Text>
          {location && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={(e) => setLocation(e.nativeEvent.coordinate)}
            >
              <Marker
                coordinate={location}
                draggable
                onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}
              />
              <Circle
                center={location}
                radius={parseInt(radius)}
                strokeColor="rgba(158, 158, 255, 1.0)"
                fillColor="rgba(158, 158, 255, 0.3)"
              />
            </MapView>
          )}
        </View>

        <TextInput
          label="Radius (meters)"
          value={radius}
          onChangeText={setRadius}
          keyboardType="numeric"
          style={styles.input}
        />

        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

        <Button
          mode="contained"
          onPress={handleCreateGroup}
          style={styles.createButton}
        >
          Create Group
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  input: {
    marginBottom: 16,
  },
  memberSection: {
    marginBottom: 16,
  },
  memberInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberInputField: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    marginLeft: 8,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 4,
  },
  mapContainer: {
    marginBottom: 16,
  },
  map: {
    height: 200,
    marginTop: 8,
    borderRadius: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  createButton: {
    marginTop: 16,
  },
}); 
