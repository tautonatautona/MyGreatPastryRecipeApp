import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';

const CustomDrawer = (props) => {
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth).then(() => {
      props.onLogout();
      props.navigation.closeDrawer();
    });
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={24} color="#333" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginLeft: 15,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 15,
  }
});

export default CustomDrawer;
