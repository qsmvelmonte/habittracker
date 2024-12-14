import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Checkbox } from '@ant-design/react-native';  // Import Checkbox from Ant Design React Native
import HomeScreen from './HomeScreen'; // Import your HomeScreen here

const Stack = createStackNavigator();

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Track Remember Me checkbox state

  // Handle login logic
  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password!');
      return;
    }

    // Sample login credentials (can be replaced with actual authentication logic)
    if (username === 'Team55' && password === 'pass') {
      // Navigate to HomeScreen if login is successful
      navigation.replace('Home', { userName: username, rememberMe });
    } else {
      Alert.alert('Invalid login', 'Please check your credentials and try again.');
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.header}>Login</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Remember Me checkbox and Forgot Password text */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          checked={rememberMe}
          onChange={e => setRememberMe(e.target.checked)}  // Update state on checkbox change
        >
          <Text style={styles.rememberMeText}>Remember Me</Text>
        </Checkbox>
        {/* Forgot Password text */}
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Signup or Forgot Password links */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>
          Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
        </Text>
      </View>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Hide header for Login screen
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // Hide header for Home screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    width: '80%', // Width of the button
    paddingVertical: 10, // Height of the button
    justifyContent: 'center', // Vertically centers the text inside the button
    alignItems: 'center', // Horizontally centers the text inside the button
    backgroundColor: '#6200EE', // Button background color
    borderRadius: 7, // Rounded corners\
    marginTop: 5,
  },
  loginButtonText: {
    color: '#fff', // Text color
    fontSize: 16, // Font size for the button text
    fontWeight: 'bold', // Make text bold
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200EE',
  },
  input: {
    width: '80%',
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#6200EE',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row', // Align checkbox and text horizontally
    alignItems: 'center', // Center both elements vertically
    marginBottom: 20, // Add some space below the checkbox container
  },
  rememberMeText: {
    fontSize: 16,
    marginLeft: 2, // Space between checkbox and text
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6200EE', // Match the link color with the theme
    marginLeft: 35, // Add space between Remember Me and Forgot Password
  },
  signupContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
});

export default App;
