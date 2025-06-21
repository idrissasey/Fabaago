import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import element from './PhoneAuthentification.tsx';
import ProfileScreen from './Profile';
//import RideSearchScreen from "./RideSearchScreen.tsx";

const Stack = createNativeStackNavigator();

const MyStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="PhoneAuthentification"
                    component={element}
                    options={{ title: 'Connexion' }}
                />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Inscription ' }}/>

              {/*//  <Stack.Screen name="RideSearchScreen" component={RideSearchScreen} options={{ title: 'Recherche Course ' }}/>*/}

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MyStack;
