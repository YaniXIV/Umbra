import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupListScreen from '../screens/GroupListScreen';
import GroupDetailScreen from '../screens/GroupDetailScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';

export type RootStackParamList = {
  GroupList: undefined;
  GroupDetail: { groupId: string };
  CreateGroup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GroupList">
        <Stack.Screen 
          name="GroupList" 
          component={GroupListScreen}
          options={{
            title: 'Groups',
            headerShown: true
          }}
        />
        <Stack.Screen 
          name="GroupDetail" 
          component={GroupDetailScreen}
          options={{
            title: 'Group Details',
            headerShown: true
          }}
        />
        <Stack.Screen 
          name="CreateGroup" 
          component={CreateGroupScreen}
          options={{
            title: 'Create Group',
            headerShown: true
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

