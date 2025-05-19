import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import GroupTile from '../components/GroupTile';
import { FAB, Text } from 'react-native-paper';
import { GetGroups } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupList'>;

interface Group {
  id: string;
  name: string;
  description?: string;
}

export default function GroupListScreen({ navigation, route }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGroups = async () => {
    try {
      setError(null);
      const response = await GetGroups();
      console.log('Groups response:', response); // Debug log
      if (response.valid && response.data?.groups) {
        setGroups(response.data.groups);
      } else {
        setError('Failed to load groups');
      }
    } catch (err) {
      console.error('Error loading groups:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      loadGroups();
      navigation.setParams({ refresh: undefined });
    }
  }, [route.params?.refresh]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadGroups();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupTile
            group={item}
            onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.centerContainer}>
            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : (
              <Text>No groups found</Text>
            )}
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0000ff']} // Android
            tintColor="#0000ff" // iOS
          />
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateGroup')}
      />
    </View>
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
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

