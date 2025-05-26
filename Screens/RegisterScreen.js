import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../Firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore'; // Add setDoc import

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setErrorMessage(''); // Clear previous error

    if (!email || !password || !confirmPassword) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create initial user document in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        name: 'User',
        email: user.email,
       // bio: 'No bio available',
        profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg',
      //  stats: { recipes: 0, followers: 0, following: 0 },
        createdAt: new Date()
      });
      
      setLoading(false);
      navigation.navigate('Login');
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Create an account and discover new recipes</Text>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, errorMessage ? styles.inputError : null]}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />

        <TouchableOpacity onPress={handleRegister} style={styles.button} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign up</Text>}
        </TouchableOpacity>

        <Text style={styles.alreadyAccount}>Already have an account</Text>
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Login here</Text>
      </View>

      <View style={styles.socialButtons}>
        <Text style={styles.orContinueWith}>Or continue with</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="google" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="facebook" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="apple" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#f9f9fb',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
    color: '#f85c6b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#000',
    fontWeight: '500',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f0f4ff',
    borderWidth: 0,
  },
  inputError: {
    borderWidth: 2,
    borderColor: '#f85c6b',
  },
  button: {
    backgroundColor: '#f85c6b',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#f85c6b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  },
  alreadyAccount: {
    marginTop: 25,
    color: '#444',
    textAlign: 'center',
    fontWeight: '700',
  },
  link: {
    color: '#f85c6b',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#f85c6b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  socialButtons: {
    marginTop: 30,
    width: '100%',
  },
  orContinueWith: {
    color: '#f85c6b',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '700',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RegisterScreen;
