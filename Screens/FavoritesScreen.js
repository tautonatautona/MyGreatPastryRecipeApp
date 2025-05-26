import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, off, remove } from "firebase/database";
import { MaterialIcons } from '@expo/vector-icons';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getDatabase();

  const removeFavorite = async (recipeId) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      await remove(ref(db, `users/${userId}/favorites/${recipeId}`));
    } catch (error) {
      Alert.alert('Error', 'Failed to remove favorite');
    }
  };

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }

    const favoritesRef = ref(db, `users/${userId}/favorites`);
    const unsubscribe = onValue(favoritesRef, (snapshot) => {
      const favoritesData = snapshot.val() || {};
      const favoritesList = Object.values(favoritesData);
      setFavorites(favoritesList);
      setLoading(false);
    });

    return () => off(favoritesRef);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!auth.currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please sign in to view favorites</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Recipes</Text>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorite recipes yet</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.recipeItem}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            >
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.recipeImage}
                />
              )}
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={styles.recipeCategory}>{item.category}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => removeFavorite(item.id)}
                style={styles.removeButton}
              >
                <MaterialIcons name="delete" size={24} color="#e74c3c" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#2c3e50',
    textAlign: 'center',
  },
  recipeItem: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  recipeCategory: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  removeButton: {
    padding: 8,
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 50,
  },
});

export default FavoritesScreen;
