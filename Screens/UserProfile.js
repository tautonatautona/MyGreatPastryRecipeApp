import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { auth, firestore, storage } from '../Firebase/firebaseConfig';
import { signOut, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const UserProfile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          navigation.replace('LoginScreen');
          return;
        }

        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = {
            uid: currentUser.uid,
            email: currentUser.email,
            name: userDocSnap.data().name || 'User',
            profileImage: userDocSnap.data().profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg'
          };
          setUser(userData);
          setName(userData.name);
          setEmail(userData.email);
        } else {
          const defaultUserData = {
            name: currentUser.displayName || 'User',
            email: currentUser.email,
            profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg',
            createdAt: new Date()
          };
          
          await setDoc(userDocRef, defaultUserData);
          setUser({
            uid: currentUser.uid,
            ...defaultUserData
          });
          setName(defaultUserData.name);
          setEmail(defaultUserData.email);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load profile data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigation.replace('LoginScreen');
    });
    return () => unsubscribe();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleEditImage = async () => {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'We need camera roll permissions to change your profile picture');
        return;
      }
  
      // Launch image picker
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
  
      if (!pickerResult.canceled) {
        setLoading(true);
        
        // Get image URI and create a filename
        const uri = pickerResult.assets[0].uri;
        const fileExtension = uri.substring(uri.lastIndexOf('.') + 1);
        const filename = `profile-${Date.now()}.${fileExtension}`;
        
        // Convert image to blob
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Create a reference to the storage location
        const storageRef = ref(storage, `profileImages/${user.uid}/${filename}`);
        
        console.log('Uploading to:', `profileImages/${user.uid}/${filename}`);
        
        // Upload the image
        await uploadBytes(storageRef, blob);
        console.log('Upload completed');
        
        // Get download URL
        let downloadURL = await getDownloadURL(storageRef);
        console.log('Download URL:', downloadURL);
        
        // Add cache busting parameter to ensure the new image is loaded
        downloadURL = `${downloadURL}?t=${Date.now()}`;
        
        // Update the user document in Firestore
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, {
          profileImage: downloadURL
        });
        console.log('Firestore updated');
  
        // Update local state
        setUser({...user, profileImage: downloadURL});
        Alert.alert('Success', 'Profile picture updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
      
      // More detailed error handling
      let errorMessage = 'Failed to update profile image';
      
      if (error.code) {
        switch(error.code) {
          case 'storage/unauthorized':
            errorMessage = 'You don\'t have permission to upload images';
            break;
          case 'storage/canceled':
            errorMessage = 'Upload was canceled';
            break;
          case 'storage/quota-exceeded':
            errorMessage = 'Storage quota exceeded';
            break;
          default:
            errorMessage = `Error: ${error.message}`;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        name: name
      });
      
      if (password) {
        await updatePassword(auth.currentUser, password);
      }

      setUser({...user, name});
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No user data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleEditImage}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: user.profileImage }}
              style={styles.profileImage}
            />
            <View style={styles.editIcon}>
              <Feather name="edit-2" size={18} color="white" />
            </View>
          </View>
        </TouchableOpacity>
        
        {editing ? (
          <>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={email}
              editable={false}
              placeholder="Email"
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="New Password"
              secureTextEntry
            />
          </>
        ) : (
          <>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {editing ? (
          <>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditing(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIcon: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: '#FF6B6B',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserProfile;
