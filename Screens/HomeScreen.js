import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import SpoonAcularAPI from '../constants/SpoonAcularAPI';
import { FAB } from 'react-native-paper';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${SpoonAcularAPI.BASE_URL}${SpoonAcularAPI.ENDPOINTS.SEARCH_RECIPES}`,
        {
          params: {
            query: searchQuery || 'Pastry',
            apiKey: SpoonAcularAPI.API_KEY,
            number: 10,
          },
        }
      );

      setRecipes(
        response.data.results.map((item) => ({
          id: item.id,
          title: item.title,
          image: item.image,
          readyInMinutes: item.readyInMinutes || 30,
        }))
      );
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRecipes();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/pexels-chanwalrus-958545.jpg')}
        style={styles.searchBackground}
        blurRadius={8}
        resizeMode="cover"
      >
  
          <Text style={styles.title}>What do you want to cook today?</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
       
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Popular Recipes</Text>

        {recipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recipes found</Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {recipes.map((item) => (
              <TouchableOpacity
                key={item.id.toString()}
                style={styles.gridItem}
                onPress={() =>
                  navigation.navigate('RecipeDetail', { recipe: item })
                }
              >
                {item.image && (
                  <Image source={{ uri: item.image }} style={styles.gridImage} />
                )}
                <Text style={styles.gridTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <View style={styles.gridMeta}>
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaText}>⏱️ {item.readyInMinutes} min</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddRecipe')}
        color="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBackground: {
    width: width,
    paddingHorizontal: 16,
    paddingVertical: 24,
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
 
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  searchInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
    marginTop: 10,
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    marginLeft: 20,
    marginVertical: 16,
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    padding: 12,
    aspectRatio: 0.85,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  gridMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  metaBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginHorizontal: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6B6B',
    borderRadius: 28,
    elevation: 5,
  },
});

export default HomeScreen;
