// Screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const SplashScreen = ({ onAnimationFinish }) => {
  const animationRef = useRef(null);

  useEffect(() => {
    // If the animation finishes or after a timeout, call the onAnimationFinish prop
    const timer = setTimeout(() => {
      if (onAnimationFinish) {
        onAnimationFinish();
      }
    }, 10000); // 7 seconds splash screen duration as set in your code

    return () => clearTimeout(timer);
  }, [onAnimationFinish]);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require('../assets/animation.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
        onAnimationFinish={() => {
          if (onAnimationFinish) {
            onAnimationFinish();
          }
        }}
      />
      <Text style={styles.title}>MyGreatPastryRecipe</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#FFA500',
  },
  lottie: {
    width: 200,
    height: 200,
  },
});