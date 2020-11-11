import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './pages/Main';
import Profile from './pages/Profile';

const Stack = createStackNavigator();
const screenOptions = {
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#7D40E7'
    }
}

function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={screenOptions} headerBackTitleVisible={false} >
                <Stack.Screen name="Main" component={Main} options={{ title: 'DevRadar' }} />
                <Stack.Screen name="Profile" component={Profile} options={{ title: 'Perfil no GitHub' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Routes;