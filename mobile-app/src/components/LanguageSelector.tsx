/**
 * Language Selector Component
 * Toggle between supported languages (EN, UR, PB)
 * @module components/LanguageSelector
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppLanguage } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: AppLanguage;
  onSelect: (language: AppLanguage) => void;
}

const languages: { code: AppLanguage; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو' },
  { code: 'pb', label: 'Punjabi', nativeLabel: 'پنجابی' },
];

export default function LanguageSelector({
  selectedLanguage,
  onSelect,
}: LanguageSelectorProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.option,
            selectedLanguage === lang.code && styles.optionSelected,
          ]}
          onPress={() => onSelect(lang.code)}
        >
          <Text
            style={[
              styles.label,
              selectedLanguage === lang.code && styles.labelSelected,
            ]}
          >
            {lang.label}
          </Text>
          <Text
            style={[
              styles.nativeLabel,
              selectedLanguage === lang.code && styles.nativeLabelSelected,
            ]}
          >
            {lang.nativeLabel}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 8 },
  option: {
    flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#F5F5F5',
    alignItems: 'center', borderWidth: 2, borderColor: 'transparent',
  },
  optionSelected: { backgroundColor: '#E8F5E9', borderColor: '#2E7D32' },
  label: { fontSize: 14, fontWeight: '600', color: '#666' },
  labelSelected: { color: '#2E7D32' },
  nativeLabel: { fontSize: 12, color: '#999', marginTop: 4 },
  nativeLabelSelected: { color: '#4CAF50' },
});
