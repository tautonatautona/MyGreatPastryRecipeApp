import React, { useState, useEffect, useContext } from 'react';
import { PreferencesContext } from '../Components/PreferencesContext';
import { View, Text, Switch, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const SettingsItem = ({ iconName, iconLib, label, onPress, isSwitch, switchValue, onSwitchChange, isDarkMode }) => {
  const IconComponent = iconLib === 'FontAwesome5' ? FontAwesome5 : MaterialCommunityIcons;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.itemContainer, isDarkMode ? styles.itemContainerDark : styles.itemContainerLight]}
      disabled={!onPress && !isSwitch}
    >
      <View style={styles.itemLeft}>
        <IconComponent
          name={iconName}
          size={20}
          color={isDarkMode ? '#fff' : '#333'}
          style={styles.itemIcon}
        />
        <Text style={[styles.itemLabel, { color: isDarkMode ? '#fff' : '#333' }]}>{label}</Text>
      </View>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          thumbColor={switchValue ? (isDarkMode ? '#fff' : '#007AFF') : undefined}
          trackColor={{ false: '#767577', true: isDarkMode ? '#81b0ff' : '#34C759' }}
        />
      ) : onPress ? (
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={isDarkMode ? '#fff' : '#999'}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const PreferencesScreen = ({ onLogout, navigation }) => {
  const {
    isDarkMode,
    toggleDarkMode,
    fontSize,
    setFontSize,
    typeface,
    setTypeface,
  } = useContext(PreferencesContext);

  const [localDarkMode, setLocalDarkMode] = useState(isDarkMode);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Example state
  const [showTypefaceOptions, setShowTypefaceOptions] = useState(false);
  const [showFontSizeOptions, setShowFontSizeOptions] = useState(false);

  useEffect(() => {
    setLocalDarkMode(isDarkMode);
  }, [isDarkMode]);

  const onToggleDarkMode = () => {
    toggleDarkMode();
    setLocalDarkMode(!localDarkMode);
  };

  const onToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const typefaces = ['System', 'Serif', 'Monospace'];
  const fontSizes = [
    { label: 'Small', value: 14 },
    { label: 'Medium', value: 18 },
    { label: 'Large', value: 22 },
  ];

  const onSelectTypeface = (selectedTypeface) => {
    setTypeface(selectedTypeface);
    setShowTypefaceOptions(false);
  };

  const onSelectFontSize = (selectedFontSize) => {
    setFontSize(selectedFontSize);
    setShowFontSizeOptions(false);
  };

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.header, { color: isDarkMode ? '#fff' : '#000', fontSize, fontFamily: typeface }]}>Settings</Text>

      <View style={[styles.section, isDarkMode ? styles.sectionDark : styles.sectionLight]}>
        <SettingsItem
          iconName="account"
          label="Account"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
          isDarkMode={isDarkMode}
        />
        <View style={styles.divider} />
        <SettingsItem
          iconName="bell"
          label="Notifications"
          isSwitch
          switchValue={notificationsEnabled}
          onSwitchChange={onToggleNotifications}
          isDarkMode={isDarkMode}
        />
        <View style={styles.divider} />
        <SettingsItem
          iconName={localDarkMode ? 'weather-night' : 'white-balance-sunny'}
          label={localDarkMode ? 'Dark Mode' : 'Light Mode'}
          isSwitch
          switchValue={localDarkMode}
          onSwitchChange={onToggleDarkMode}
          isDarkMode={isDarkMode}
        />
        <View style={styles.divider} />
        <SettingsItem
          iconName="earth"
          label="Language"
          onPress={() => alert('Language settings')}
          isDarkMode={isDarkMode}
        />
        <View style={styles.divider} />
        <SettingsItem
          iconName="format-font"
          label={`Typeface: ${typeface}`}
          onPress={() => setShowTypefaceOptions(true)}
          isDarkMode={isDarkMode}
        />
        <View style={styles.divider} />
        <SettingsItem
          iconName="format-size"
          label={`Font Size: ${fontSizes.find(fs => fs.value === fontSize)?.label || 'Medium'}`}
          onPress={() => setShowFontSizeOptions(true)}
          isDarkMode={isDarkMode}
        />
      </View>

      <View style={[styles.section, isDarkMode ? styles.sectionDark : styles.sectionLight]}>
        <SettingsItem
          iconName="shield-check"
          label="Security"
          onPress={() => alert('Security settings')}
          isDarkMode={isDarkMode}
        />
        <View style={styles.divider} />
        <SettingsItem
          iconName="file-document"
          label="Terms & Conditions"
          onPress={() => alert('Terms & Conditions')}
          isDarkMode={isDarkMode}
        />
        <View style={styles.divider} />
        <SettingsItem
          iconName="lock"
          label="Privacy Policy"
          onPress={() => alert('Privacy Policy')}
          isDarkMode={isDarkMode}
        />
        <View style={styles.divider} />
        <SettingsItem
          iconName="help-circle"
          label="Help"
          onPress={() => alert('Help')}
          isDarkMode={isDarkMode}
        />
      </View>

      <View style={[styles.section, isDarkMode ? styles.sectionDark : styles.sectionLight]}>
        <SettingsItem
          iconName="account-multiple-plus"
          label="Invite a friend"
          onPress={() => alert('Invite a friend')}
          isDarkMode={isDarkMode}
        />
        <View style={styles.divider} />
        <SettingsItem
          iconName="logout"
          label="Logout"
          onPress={onLogout}
          isDarkMode={isDarkMode}
        />
      </View>

      {showTypefaceOptions && (
        <View style={[styles.modalContainer, isDarkMode ? styles.modalContainerDark : styles.modalContainerLight]}>
          {typefaces.map((tf) => (
            <TouchableOpacity
              key={tf}
              onPress={() => onSelectTypeface(tf)}
              style={styles.modalItem}
            >
              <Text style={[styles.modalItemText, { fontWeight: tf === typeface ? 'bold' : 'normal', color: isDarkMode ? '#fff' : '#000' }]}>
                {tf}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setShowTypefaceOptions(false)} style={styles.modalCloseButton}>
            <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {showFontSizeOptions && (
        <View style={[styles.modalContainer, isDarkMode ? styles.modalContainerDark : styles.modalContainerLight]}>
          {fontSizes.map((fs) => (
            <TouchableOpacity
              key={fs.value}
              onPress={() => onSelectFontSize(fs.value)}
              style={styles.modalItem}
            >
              <Text style={[styles.modalItemText, { fontWeight: fs.value === fontSize ? 'bold' : 'normal', color: isDarkMode ? '#fff' : '#000' }]}>
                {fs.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setShowFontSizeOptions(false)} style={styles.modalCloseButton}>
            <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#f2f2f7',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sectionLight: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  sectionDark: {
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemContainerLight: {
    backgroundColor: '#fff',
  },
  itemContainerDark: {
    backgroundColor: '#1e1e1e',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 15,
  },
  itemLabel: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 0,
  },
  modalContainer: {
    position: 'absolute',
    top: 100,
    left: 40,
    right: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    zIndex: 1000,
  },
  modalContainerDark: {
    backgroundColor: '#333',
  },
  modalContainerLight: {
    backgroundColor: '#fff',
  },
  modalItem: {
    paddingVertical: 10,
  },
  modalItemText: {
    fontSize: 18,
  },
  modalCloseButton: {
    marginTop: 15,
    alignItems: 'center',
  },
});
  
export default PreferencesScreen;
