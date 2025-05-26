import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/firebaseConfig';

const LoginScreen = ({ navigation, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login here</Text>
      <Text style={styles.subtitle}>Welcome back you’ve been missed!</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <View style={[styles.inputContainer, styles.emailInputContainer]}>
        <TextInput
          placeholder="Email"
          style={[styles.input, styles.emailInput]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#7f8c8d"
        />
      </View>
      
      <View style={[styles.inputContainer, styles.passwordInputContainer]}>
        <TextInput
          placeholder="Password"
          style={[styles.input, styles.passwordInput]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#7f8c8d"
        />
      </View>

      <TouchableOpacity 
        onPress={() => alert('Forgot password pressed')} 
        style={styles.forgotPasswordContainer}
      >
        <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleLogin} 
        style={styles.button} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Sign in</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.createAccountText}>Create new account</Text>
      </TouchableOpacity>

      <Text style={styles.orContinueText}>Or continue with</Text>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton} onPress={() => alert('Google login')}>
          <AntDesign name="google" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={() => alert('Facebook login')}>
          <Entypo name="facebook" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={() => alert('Apple login')}>
          <FontAwesome name="apple" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FF6B6B',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
    color: '#000',
  },
  inputContainer: {
    marginBottom: 15,
  },
  emailInputContainer: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 10,
    backgroundColor: '#f0f4ff',
  },
  passwordInputContainer: {
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: '#f0f4ff',
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
  emailInput: {
    borderRadius: 10,
  },
  passwordInput: {
    borderRadius: 10,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  createAccountText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  orContinueText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 15,
    color: '#FF6B6B',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  error: {
    color: '#e74c3c',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default LoginScreen;
