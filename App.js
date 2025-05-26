import React, { useState, useEffect } from 'react';
import { StatusBar, View, Text, Button, StyleSheet } from 'react-native';
import SplashScreen from './Components/SplashScreen';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { PreferencesProvider } from './Components/PreferencesContext';

// Screens
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import HomeScreen from './Screens/HomeScreen';
import FavoritesScreen from './Screens/FavoritesScreen';
import RecipeDetailScreen from './Screens/RecipeDetailScreen';
import UserProfile from './Screens/UserProfile';
import UserRecipesScreen from './Screens/UserRecipesScreen';
import WeightConversion from './Screens/WeightConversion';
import AddRecipeScreen from './Screens/AddRecipeScreen';
import PreferencesScreen from './Screens/PreferencesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Home stack with header hidden
const HomeStackScreen = (props) => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    <HomeStack.Screen name="AddRecipe" component={AddRecipeScreen} />
    <HomeStack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    <HomeStack.Screen name="UserRecipes" component={UserRecipesScreen} />
    <HomeStack.Screen name="WeightConversion" component={WeightConversion} />
    <HomeStack.Screen name="UserProfile" component={UserProfile} />
    <HomeStack.Screen name="Favorites" component={FavoritesScreen} />
  </HomeStack.Navigator>
);

// Bottom tab with nested stacks and icons
const MainTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Favorites"
      component={FavoritesScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="heart" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Convert"
      component={WeightConversion}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="scale-balance" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Preferences"
      component={PreferencesScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="cog" color={color} size={size} />
        ),
      }}
    />
   
  </Tab.Navigator>
);

// Drawer navigation
const MainDrawer = ({ onLogout }) => (
  <Drawer.Navigator
    initialRouteName="MainTabs"
    drawerContent={(props) => (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Preferences"
          onPress={() => props.navigation.navigate('Preferences')}
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          )}
          labelStyle={{ fontSize: 16, fontFamily: 'System' }}
        />
        <View style={styles.drawerButtonContainer}>
          <Button title="Sign Out" onPress={onLogout} />
        </View>
      </DrawerContentScrollView>
    )}
  >
    <Drawer.Screen
      name="MainTabs"
      component={MainTabs}
      options={{
        title: 'Home',
        drawerIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }}
    />
    <Drawer.Screen
      name="FavoritesDrawer"
      component={FavoritesScreen}
      options={{
        title: 'Favorites',
        drawerIcon: ({ color, size }) => (
          <FontAwesome5 name="heart" color={color} size={size} />
        ),
      }}
    />
    <Drawer.Screen
      name="ProfileDrawer"
      component={UserProfile}
      options={{
        title: 'Profile',
        drawerIcon: ({ color, size }) => (
          <FontAwesome5 name="user" color={color} size={size} />
        ),
      }}
    />
    <Drawer.Screen
      name="MyRecipes"
      component={UserRecipesScreen}
      options={{
        title: 'My Recipes',
        drawerIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="book" color={color} size={size} />
        ),
      }}
    />
    <Drawer.Screen
      name="Preferences"
      component={PreferencesScreen}
      options={{
        title: 'Preferences',
        drawerIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="cog" color={color} size={size} />
        ),
      }}
    />
  </Drawer.Navigator>
);

// Auth stack
const AuthStack = ({ setIsLoggedIn }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login">
      {(props) => <LoginScreen {...props} onLoginSuccess={() => setIsLoggedIn(true)} />}
    </Stack.Screen>
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const storedLogin = await AsyncStorage.getItem('loggedIn');
        setIsLoggedIn(storedLogin === 'true');
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };
    
    checkLogin();
  }, []);

  const handleLogin = async () => {
    await AsyncStorage.setItem('loggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedIn');
    setIsLoggedIn(false);
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <PreferencesProvider>
      <StatusBar />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="Main">
                {(props) => (
                  <MainDrawer
                    {...props}
                    onLogout={handleLogout}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
            </>
          ) : (
            <Stack.Screen name="Auth">
              {(props) => <AuthStack {...props} setIsLoggedIn={handleLogin} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PreferencesProvider>
  );
}

const styles = StyleSheet.create({
  drawerButtonContainer: {
    marginTop: 20,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});
