import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import axios from 'axios';
import SpoonAcularAPI from '../constants/SpoonAcularAPI';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, remove, onValue, off } from "firebase/database";
import { MaterialIcons } from '@expo/vector-icons';

const RecipeDetailScreen = ({ route, navigation }) => {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    // Check if recipe is already favorited
    const checkFavoriteStatus = () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const favoriteRef = ref(db, `users/${userId}/favorites/${route.params.recipe.id}`);
      onValue(favoriteRef, (snapshot) => {
        setIsFavorite(snapshot.exists());
      });

      return () => off(favoriteRef);
    };

    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${route.params.recipe.id}/information`,
          {
            params: {
              includeNutrition: false,
              apiKey: SpoonAcularAPI.API_KEY
            }
          }
        );

        setRecipeDetails(response.data);
        if (response.data.extendedIngredients) {
          setIngredients(response.data.extendedIngredients);
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    fetchRecipeDetails();
    checkFavoriteStatus();
  }, [route.params.recipe.id]);

  const toggleFavorite = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert('Please sign in to save favorites');
      return;
    }

    const favoriteRef = ref(db, `users/${userId}/favorites/${route.params.recipe.id}`);

    if (isFavorite) {
      // Remove the favorite
      await remove(favoriteRef);
    } else {
      // Add the favorite with the recipe ID
      await set(favoriteRef, {
        id: route.params.recipe.id, // Ensure the ID is included
        title: recipeDetails?.title,
        image: recipeDetails?.image,
        addedAt: Date.now()
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {recipeDetails ? (
        <>
          <Text style={styles.title}>{recipeDetails.title}</Text>
          
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>
              ⏱️ {recipeDetails.readyInMinutes} mins
            </Text>
            <Text style={styles.metaText}>
              🍽️ Serves {recipeDetails.servings}
            </Text>
          </View>

          <View style={styles.imageContainer}>
            {recipeDetails.image && (
              <Image
                source={{ uri: recipeDetails.image }}
                style={styles.image}
              />
            )}
            <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
              <MaterialIcons
                name={isFavorite ? "favorite" : "favorite-border"}
                size={24}
                color={isFavorite ? "red" : "black"}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Ingredients:</Text>
          {ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              • {ingredient.original}
            </Text>
          ))}

          {/* Simple divider using View */}
          <View style={{height: 1, backgroundColor: '#ccc', marginVertical: 20}} />

          <Text style={styles.subtitle}>Instructions:</Text>
          <Text style={styles.instructions}>
            {recipeDetails.instructions || "No instructions available"}
          </Text>
        </>
      ) : (
        <Text style={styles.title}>Loading recipe...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metaText: {
    fontSize: 16,
    color: '#666',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 15,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 8,
    paddingLeft: 15,
    lineHeight: 22,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    textAlign: 'justify',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 250,
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    padding: 8,
    elevation: 3,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  }
});

export default RecipeDetailScreen;
