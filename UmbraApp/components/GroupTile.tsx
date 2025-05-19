import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Group {
  id: string;
  name: string;
}

interface Props {
  group: Group;
  onPress: () => void;
}

export default function GroupTile({ group, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.tile} onPress={onPress}>
      <Text style={styles.text}>{group.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
  },
});

