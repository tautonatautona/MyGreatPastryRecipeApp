import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, firestore, storage } from '../Firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AddRecipeScreen = ({ navigation }) => {
  const [recipe, setRecipe] = useState({
    title: '',
    ingredients: [''],
    instructions: '',
    cookingTime: '',
    difficulty: 'Easy',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddIngredient = () => {
    setRecipe({...recipe, ingredients: [...recipe.ingredients, '']});
  };

  const handleIngredientChange = (text, index) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = text;
    setRecipe({...recipe, ingredients: newIngredients});
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setRecipe({...recipe, image: result.assets[0].uri});
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Upload image to Firebase Storage if selected
      let imageUrl = null;
      if (recipe.image) {
        // Check if firebase storage is available
      const response = await fetch(recipe.image);
      const blob = await response.blob();
      const storageRef = ref(storage, `recipes/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      imageUrl = await getDownloadURL(storageRef);
      }
  
      // Check if firebase firestore is available
      // Save recipe data to Firestore
      // First verify user is authenticated
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }
      
      const recipeData = {
        title: recipe.title,
        ingredients: recipe.ingredients.filter(i => i.trim() !== ''),
        instructions: recipe.instructions,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        image: imageUrl,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        public: false // Add public flag for permissions
      };

      // Add to recipes collection
      const recipeRef = await addDoc(collection(firestore, 'recipes'), recipeData);
      
      // Also add to user's personal recipes subcollection
      await addDoc(collection(firestore, `users/${auth.currentUser.uid}/recipes`), {
        recipeId: recipeRef.id,
        addedAt: serverTimestamp()
      });
  
      navigation.goBack();
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Recipe</Text>

      <Text style={styles.label}>Recipe Name</Text>
      <TextInput
        style={styles.input}
        value={recipe.title}
        onChangeText={(text) => setRecipe({...recipe, title: text})}
        placeholder="Enter recipe name"
      />

      <Text style={styles.label}>Ingredients</Text>
      {recipe.ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientRow}>
          <TextInput
            style={[styles.input, styles.ingredientInput]}
            value={ingredient}
            onChangeText={(text) => handleIngredientChange(text, index)}
            placeholder={`Ingredient ${index + 1}`}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
        <Text style={styles.addButtonText}>+ Add Ingredient</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Instructions</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={recipe.instructions}
        onChangeText={(text) => setRecipe({...recipe, instructions: text})}
        placeholder="Enter step-by-step instructions"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Cooking Time (minutes)</Text>
      <TextInput
        style={styles.input}
        value={recipe.cookingTime}
        onChangeText={(text) => setRecipe({...recipe, cookingTime: text})}
        placeholder="Enter cooking time"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Difficulty</Text>
      <View style={styles.radioContainer}>
        {['Easy', 'Medium', 'Hard'].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.radioButton,
              recipe.difficulty === level && styles.radioButtonSelected
            ]}
            onPress={() => setRecipe({...recipe, difficulty: level})}
          >
            <Text style={styles.radioText}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Recipe Image</Text>
      <Button title="Select Image" onPress={pickImage} />
      {recipe.image && (
        <Image source={{ uri: recipe.image }} style={styles.previewImage} />
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Saving...' : 'Save Recipe'}
        </Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ingredientInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#333',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  radioText: {
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddRecipeScreen;
