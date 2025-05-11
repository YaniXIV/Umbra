import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import GroupTile from '../components/GroupTile';
import { FAB } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupList'>;

const groups = [
  { id: '1', name: 'Group Alpha' },
  { id: '2', name: 'Group Beta' },
];

export default function GroupListScreen({ navigation }: Props) {
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
    padding: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

