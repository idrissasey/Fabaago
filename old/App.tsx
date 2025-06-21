import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import MyStack from './MyStack';


const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <MyStack />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
