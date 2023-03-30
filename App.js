import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignupScreen } from './src/screens/SignupScreen';
import { ForgetPasswordScreen } from './src/screens/ForgetPassword';
import { LoginScreen } from './src/screens/LoginScreen';
import { Profiles } from './src/screens/Profiles';
import { ChatScreen } from './src/screens/ChatScreen';



const AppStack = createNativeStackNavigator();
function App() {        

  return (
    <NavigationContainer>
      <AppStack.Navigator initialRouteName="Login">
        <AppStack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <AppStack.Screen name='Profiles' component={Profiles} options={{ headerShown: false }} />
        <AppStack.Screen options={{ headerShown: false }} name='Signup' component={SignupScreen} />
      <AppStack.Screen name='ForgetPassword' component={ForgetPasswordScreen} options={{ headerShown: false }} />
      <AppStack.Screen name='Chat' component={ChatScreen} options={{headerShown : false}}></AppStack.Screen>
      </AppStack.Navigator>

    </NavigationContainer>
  );
}

export default App;