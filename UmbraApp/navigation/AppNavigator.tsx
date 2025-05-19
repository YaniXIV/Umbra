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
      <Stack.Navigator
        initialRouteName="GroupList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1E1E1E',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="GroupList" 
          component={GroupListScreen}
          options={{ title: 'Groups' }}
        />
        <Stack.Screen 
          name="GroupDetail" 
          component={GroupDetailScreen}
          options={{ title: 'Group Details' }}
        />
        <Stack.Screen 
          name="CreateGroup" 
          component={CreateGroupScreen}
          options={{ title: 'Create Group' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

