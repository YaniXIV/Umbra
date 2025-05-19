import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { Text, Button, List } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { GetGroups, GenerateProof } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import * as Location from 'expo-location';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupDetail'>;

interface GroupMember {
  id: string;
  name: string;
  email: string;
  verified: boolean;
}

interface GroupDetails {
  id: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  members: GroupMember[];
}

// Mock user data for testing
const mockUsers: { [key: string]: GroupMember } = {
  'test-user-123': {
    id: 'test-user-123',
    name: 'Test User',
    email: 'test@example.com',
    verified: false
  },
  'alice': {
    id: 'alice',
    name: 'Alice Smith',
    email: 'alice@example.com',
    verified: false
  },
  'bob': {
    id: 'bob',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    verified: true
  }
};

// Constants for coordinate conversion
const DEG_TO_RAD = Math.PI / 180;
const METERS_PER_DEGREE = 111320; // average
const EDMONTON_LAT = 53.5; // Edmonton reference latitude

// Function to convert lat/lon to meters using Edmonton reference
const latlonToMeters = (lat: number, lon: number): { x: number, y: number } => {
  const cosLat = Math.cos(EDMONTON_LAT * DEG_TO_RAD);
  const x = lon * cosLat * METERS_PER_DEGREE;
  const y = lat * METERS_PER_DEGREE;
  return {
    x: Math.round(x),
    y: Math.round(y)
  };
};

export default function GroupDetailScreen({ route }: Props) {
  const { groupId } = route.params;
  const { user: currentUser } = useAuth();
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProving, setIsProving] = useState(false);

  useEffect(() => {
    loadGroupDetails();
  }, [groupId]);

  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await GetGroups();
      if (response.valid && response.data?.groups) {
        // Find the specific group from the list
        const group = response.data.groups.find(g => g.id === groupId);
        if (group) {
          // Transform the group data to match our interface
          const transformedGroup: GroupDetails = {
            id: group.id,
            name: group.name,
            description: group.description || '',
            location: {
              latitude: parseFloat(group.location.latitude),
              longitude: parseFloat(group.location.longitude)
            },
            radius: group.radius,
            members: group.members.map((member: any) => {
              // The member could be a string (username) or an object
              const username = typeof member === 'string' ? member : (member.username || member.id || member.user_id);
              
              // Use mock data for member information
              const mockUser = mockUsers[username] || {
                id: username,
                name: username, // Use the username as the name
                email: `${username}@example.com`,
                verified: false
              };
              
              return {
                ...mockUser,
                verified: typeof member === 'object' ? (member.verified || false) : false
              };
            })
          };
          setGroupDetails(transformedGroup);
        } else {
          setError('Group not found');
        }
      } else {
        setError('Failed to load group details');
      }
    } catch (err) {
      console.error('Error loading group details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleProve = async () => {
    if (!groupDetails) {
      setError('Group details not available');
      return;
    }

    try {
      setIsProving(true);
      setError(null); // Clear any previous errors
      
      // Get user's current location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      
      // Convert coordinates to meters
      const privateCoords = latlonToMeters(
        location.coords.latitude,
        location.coords.longitude
      );
      const publicCoords = latlonToMeters(
        groupDetails.location.latitude,
        groupDetails.location.longitude
      );

      // Use raw meter values and square the radius
      const radiusSquared = groupDetails.radius * groupDetails.radius;

      // Format coordinates as strings with i32 suffix
      const privateXStr = `${privateCoords.x}i32`;
      const privateYStr = `${privateCoords.y}i32`;
      const publicXStr = `${publicCoords.x}i32`;
      const publicYStr = `${publicCoords.y}i32`;
      const radiusStr = `${radiusSquared}i32`;

      console.log('Generating proof with coordinates:', {
        private: { x: privateXStr, y: privateYStr },
        public: { x: publicXStr, y: publicYStr },
        radius: radiusStr
      });

      // Call the proof generation API
      const result = await GenerateProof({
        userId: currentUser.id,
        groupId: groupId,
        privateLocation: {
          latitude: privateXStr,
          longitude: privateYStr
        },
        publicLocation: {
          latitude: publicXStr,
          longitude: publicYStr
        },
        radius: radiusStr
      });

      if (result.valid) {
        // Update the group details with the new verification status
        const updatedMembers = groupDetails.members.map(member => {
          if (member.name === "Test") {
            return { ...member, verified: true };
          }
          return member;
        });
        
        setGroupDetails({
          ...groupDetails,
          members: updatedMembers
        });
      } else {
        setError('Proof generation failed. Please try again.');
      }
    } catch (err) {
      console.error('Error generating proof:', err);
      setError('Failed to generate proof. Please try again.');
    } finally {
      setIsProving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!groupDetails) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.error}>Group not found</Text>
      </View>
    );
  }

  const isCurrentUserVerified = groupDetails.members.find(
    member => member.id === currentUser.id
  )?.verified || false;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{groupDetails.name}</Text>
        <Text style={styles.subtitle}>Group ID: {groupDetails.id}</Text>
        <Text style={styles.description}>{groupDetails.description}</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: groupDetails.location.latitude,
            longitude: groupDetails.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: groupDetails.location.latitude,
              longitude: groupDetails.location.longitude,
            }}
            title={groupDetails.name}
          />
          <Circle
            center={{
              latitude: groupDetails.location.latitude,
              longitude: groupDetails.location.longitude,
            }}
            radius={groupDetails.radius}
            strokeColor="rgba(0,0,255,0.5)"
            fillColor="rgba(0,0,255,0.1)"
          />
        </MapView>
      </View>

      <View style={styles.membersContainer}>
        <Text style={styles.sectionTitle}>Members</Text>
        {groupDetails.members.map((member) => (
          <List.Item
            key={member.id}
            title={member.name}
            description={member.email}
            left={props => <List.Icon {...props} icon="account" />}
            right={props => (
              member.verified ? 
                <List.Icon {...props} icon="check-circle" color="green" /> :
                <List.Icon {...props} icon="clock-outline" color="orange" />
            )}
          />
        ))}
      </View>

      {!isCurrentUserVerified && (
        <Button
          mode="contained"
          onPress={handleProve}
          style={styles.proveButton}
          loading={isProving}
          disabled={isProving}
        >
          {isProving ? 'Generating Proof...' : 'Generate Proof'}
        </Button>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  mapContainer: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  map: {
    width: Dimensions.get('window').width - 32,
    height: 300,
  },
  membersContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  error: {
    color: '#c62828',
    textAlign: 'center',
  },
  proveButton: {
    margin: 16,
  },
});

