import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignupScreen } from './src/screens/SignupScreen';
import { ForgetPasswordScreen } from './src/screens/ForgetPassword';
import { LoginScreen } from './src/screens/LoginScreen';
import { Profiles } from './src/screens/Profiles';
import { ChatScreen } from './src/screens/ChatScreen';
import {SettingScreen}  from './src/screens/SettingScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import ThemContextProvider from './src/store/context/ThemeContext';



const AppStack = createNativeStackNavigator();
function App() {

  return (
    <ThemContextProvider>
    <NavigationContainer>
      <AppStack.Navigator initialRouteName="Login">
        <AppStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <AppStack.Screen name='Profiles' component={Profiles} options={{ headerShown: false }} />
        <AppStack.Screen name='Signup' component={SignupScreen} options={{ headerShown: false }} />
        <AppStack.Screen name='Settings' component={SettingScreen} options={{ headerShown: false }} />
        <AppStack.Screen name='Accounts' component={AccountScreen} options={{ headerShown: false }} />
        <AppStack.Screen name='ForgetPassword' component={ForgetPasswordScreen} options={{ headerShown: false }} />
        <AppStack.Screen name='Chat' component={ChatScreen} options={{ headerShown: false }}></AppStack.Screen>
      </AppStack.Navigator>
    </NavigationContainer>
    </ThemContextProvider>
  );
}

export default App;