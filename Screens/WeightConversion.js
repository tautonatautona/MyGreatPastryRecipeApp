import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const WeightConversionScreen = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('grams');
  const [showDropdown, setShowDropdown] = useState(false);
  const [convertedValues, setConvertedValues] = useState({
    grams: '',
    ounces: '',
    pounds: ''
  });

  const units = [
    { label: 'Grams (g)', value: 'grams' },
    { label: 'Ounces (oz)', value: 'ounces' },
    { label: 'Pounds (lb)', value: 'pounds' },
  ];

  const convertWeight = (value, unit) => {
    if (value === '') {
      setConvertedValues({
        grams: '',
        ounces: '',
        pounds: ''
      });
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    switch (unit) {
      case 'grams':
        setConvertedValues({
          grams: value,
          ounces: (numValue * 0.035274).toFixed(2),
          pounds: (numValue * 0.00220462).toFixed(2)
        });
        break;
      case 'ounces':
        setConvertedValues({
          grams: (numValue * 28.3495).toFixed(2),
          ounces: value,
          pounds: (numValue * 0.0625).toFixed(2)
        });
        break;
      case 'pounds':
        setConvertedValues({
          grams: (numValue * 453.592).toFixed(2),
          ounces: (numValue * 16).toFixed(2),
          pounds: value
        });
        break;
    }
  };

  const clearAll = () => {
    setInputValue('');
    setConvertedValues({
      grams: '',
      ounces: '',
      pounds: ''
    });
  };

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
    setShowDropdown(false);
    convertWeight(inputValue, unit);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Weight Converter</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Convert From:</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text style={styles.dropdownButtonText}>
                {units.find(u => u.value === selectedUnit)?.label || 'Select unit'}
              </Text>
              <MaterialIcons 
                name={showDropdown ? 'arrow-drop-up' : 'arrow-drop-down'} 
                size={24} 
                color="#555" 
              />
            </TouchableOpacity>

            <Modal
              visible={showDropdown}
              transparent
              animationType="fade"
              onRequestClose={() => setShowDropdown(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
                <View style={styles.modalOverlay} />
              </TouchableWithoutFeedback>
              
              <View style={styles.dropdownOptions}>
                {units.map((unit) => (
                  <TouchableOpacity
                    key={unit.value}
                    style={[
                      styles.optionItem,
                      selectedUnit === unit.value && styles.selectedOption
                    ]}
                    onPress={() => handleUnitSelect(unit.value)}
                  >
                    <Text style={styles.optionText}>{unit.label}</Text>
                    {selectedUnit === unit.value && (
                      <MaterialIcons name="check" size={20} color="#FF6B6B" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </Modal>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Value:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={inputValue}
              onChangeText={(text) => {
                setInputValue(text);
                convertWeight(text, selectedUnit);
              }}
              placeholder={`Enter value in ${selectedUnit}`}
            />
          </View>

          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>Conversion Results</Text>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Grams (g):</Text>
              <Text style={styles.resultValue}>{convertedValues.grams || '-'}</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Ounces (oz):</Text>
              <Text style={styles.resultValue}>{convertedValues.ounces || '-'}</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Pounds (lb):</Text>
              <Text style={styles.resultValue}>{convertedValues.pounds || '-'}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[
              styles.clearButton,
              !inputValue && styles.clearButtonDisabled
            ]} 
            onPress={clearAll}
            disabled={!inputValue}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: Platform.OS === 'ios' ? 80 : 60, // Add padding for tab bar
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  // card: {
  //   backgroundColor: 'white',
  //   borderRadius: 12,
  //   padding: 24,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 6,
  //   elevation: 3,
  // },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2c3e50',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#34495e',
    fontWeight: '500',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#2d3436',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownOptions: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    top: 100, // Position below the dropdown button
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectedOption: {
    backgroundColor: '#f5f5f5',
  },
  optionText: {
    fontSize: 16,
    color: '#2d3436',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#2d3436',
  },
  resultsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6e9',
  },
  resultLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    opacity: 1,
  },
  clearButtonDisabled: {
    opacity: 0.5,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WeightConversionScreen;