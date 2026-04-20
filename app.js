import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, 
  KeyboardAvoidingView, Platform, ActivityIndicator, SafeAreaView, Keyboard
} from 'react-native';

export default function App() {
  // 1. SINGLE STATE OBJECT: Holds all form field values
  const [form, setForm] = useState({
    searchMode: 'vehicle', // 'vehicle' or 'vin'
    make: '',
    year: '',
    modelKeyword: '', // Wildcard search
    vins: '', // Comma-separated VINs
    limit: 10, // 10, 25, or 50
  });

  // UI and Data States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [results, setResults] = useState([]);

  // 2. SHARED CHANGE HANDLER: Updates the correct field by key
  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
    // Clear the specific validation error when the user starts typing again
    setValidationErrors({ ...validationErrors, [key]: null });
  };

  // Helper function to switch tabs and clear results
  const switchMode = (mode) => {
    handleChange('searchMode', mode);
    setResults([]);
    setError(null);
    setValidationErrors({});
  };

  // 3. VALIDATION & API CALL
  const handleSubmit = async () => {
    Keyboard.dismiss();
    let errors = {};

    // --- Inline Validation ---
    if (form.searchMode === 'vehicle') {
      if (!form.make.trim()) errors.make = 'Make is required (e.g., Toyota)';
      if (!form.year.trim() || isNaN(form.year) || parseInt(form.year) < 1886) {
        errors.year = 'Enter a valid year (1886 or newer)';
      }
    } else {
      if (!form.vins.trim()) errors.vins = 'Please enter at least one VIN';
      else {
        const vinArray = form.vins.split(',').map(v => v.trim()).filter(v => v);
        if (vinArray.length > 50) errors.vins = 'Maximum of 50 VINs allowed per batch';
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return; // Stop execution if validation fails
    }

    // --- API Fetching ---
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      let data;

      if (form.searchMode === 'vehicle') {
        // GET Request for Make/Year
        const response = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${form.make}/modelyear/${form.year}?format=json`
        );
        data = await response.json();
        
        let fetchedResults = data.Results || [];
        
        // Wildcard local filtering if the user entered a model keyword
        if (form.modelKeyword.trim()) {
          fetchedResults = fetchedResults.filter(v => 
            v.Model_Name.toLowerCase().includes(form.modelKeyword.toLowerCase())
          );
        }
        
        // Apply pagination/limit logic
        setResults(fetchedResults.slice(0, form.limit));

      } else {
        // POST Request for Batch VIN Decoding
        const vinArray = form.vins.split(',').map(v => v.trim()).filter(v => v);
        const vinString = vinArray.join(';');

        const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValuesBatch/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `format=json&data=${vinString}`
        });
        
        data = await response.json();
        setResults(data.Results || []);
      }
    } catch (err) {
      setError('Network error. Failed to communicate with NHTSA servers.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setForm({ ...form, make: '', year: '', modelKeyword: '', vins: '' });
    setResults([]);
    setError(null);
    setValidationErrors({});
  };

  // 4. RENDER ITEM FOR FLATLIST
  const renderItem = ({ item }) => {
    if (form.searchMode === 'vehicle') {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.Make_Name} {item.Model_Name}</Text>
          <Text style={styles.cardSub}>Model ID: {item.Model_ID}</Text>
        </View>
      );
    }

    // VIN Result Rendering
    const vinCount = form.vins.split(',').map(v => v.trim()).filter(v => v).length;
    const showDetails = vinCount <= 3; // Rule: Hide deep details if > 3 VINs

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.ModelYear} {item.Make} {item.Model}</Text>
        <Text style={styles.cardSub}>VIN: {item.VIN}</Text>
        <Text style={styles.cardSub}>Trim: {item.Trim || 'N/A'}</Text>
        
        {/* Dynamic Detailed Rendering */}
        {showDetails && (
          <View style={styles.detailsBox}>
            <Text style={styles.detailText}>• Engine: {item.DisplacementL}L {item.EngineConfiguration} {item.EngineCylinders}</Text>
            <Text style={styles.detailText}>• Drive: {item.DriveType || 'N/A'}</Text>
            <Text style={styles.detailText}>• Plant: {item.PlantCity}, {item.PlantCountry}</Text>
            <Text style={styles.detailText}>• Body: {item.BodyClass}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.headerTitle}>The Garage</Text>

        {/* Tab Selection */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, form.searchMode === 'vehicle' && styles.tabActive]}
            onPress={() => switchMode('vehicle')}
          >
            <Text style={[styles.tabText, form.searchMode === 'vehicle' && styles.tabTextActive]}>Vehicle Search</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, form.searchMode === 'vin' && styles.tabActive]}
            onPress={() => switchMode('vin')}
          >
            <Text style={[styles.tabText, form.searchMode === 'vin' && styles.tabTextActive]}>VIN Decoder</Text>
          </TouchableOpacity>
        </View>

        {/* Form Inputs based on Mode */}
        {form.searchMode === 'vehicle' ? (
          <>
            <TextInput
              style={[styles.input, validationErrors.make && styles.inputError]}
              placeholder="Make (e.g. Toyota)"
              value={form.make}
              onChangeText={(val) => handleChange('make', val)}
            />
            {validationErrors.make && <Text style={styles.errorText}>{validationErrors.make}</Text>}

            <TextInput
              style={[styles.input, validationErrors.year && styles.inputError]}
              placeholder="Year (e.g. 2004)"
              keyboardType="numeric"
              value={form.year}
              onChangeText={(val) => handleChange('year', val)}
            />
            {validationErrors.year && <Text style={styles.errorText}>{validationErrors.year}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Model Keyword (Optional Wildcard)"
              value={form.modelKeyword}
              onChangeText={(val) => handleChange('modelKeyword', val)}
            />

            {/* Limit Selector */}
            <Text style={styles.limitLabel}>Result Limit:</Text>
            <View style={styles.limitContainer}>
              {[10, 25, 50].map((num) => (
                <TouchableOpacity 
                  key={num} 
                  style={[styles.limitBtn, form.limit === num && styles.limitBtnActive]}
                  onPress={() => handleChange('limit', num)}
                >
                  <Text style={form.limit === num ? styles.limitTextActive : styles.limitText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <TextInput
              style={[styles.input, styles.textArea, validationErrors.vins && styles.inputError]}
              placeholder="Enter VINs (comma separated, max 50)"
              multiline
              value={form.vins}
              onChangeText={(val) => handleChange('vins', val)}
            />
            {validationErrors.vins && <Text style={styles.errorText}>{validationErrors.vins}</Text>}
            <Text style={styles.helperText}>*Detailed specs are hidden if decoding more than 3 VINs.</Text>
          </>
        )}

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.submitBtnText}>{loading ? 'Searching...' : 'Search'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearBtn} onPress={clearForm} disabled={loading}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* UI Feedback States */}
        {loading && <ActivityIndicator size="large" color="#0056b3" style={{ marginTop: 20 }} />}
        {error && <Text style={styles.globalError}>{error}</Text>}
        {!loading && results.length === 0 && !error && form.make !== '' && (
          <Text style={styles.noResultsText}>No vehicles found. Try adjusting your search.</Text>
        )}

        {/* FlatList Results */}
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  keyboardView: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center', marginBottom: 15 },
  
  tabContainer: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#e2e8f0', borderRadius: 8, overflow: 'hidden' },
  tabButton: { flex: 1, padding: 12, alignItems: 'center' },
  tabActive: { backgroundColor: '#0056b3' },
  tabText: { fontSize: 16, color: '#4a5568', fontWeight: '600' },
  tabTextActive: { color: '#fff' },

  input: { backgroundColor: '#fff', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e0', marginBottom: 8, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  inputError: { borderColor: '#e53e3e', borderWidth: 2 },
  errorText: { color: '#e53e3e', fontSize: 13, marginBottom: 10, marginLeft: 4 },
  helperText: { color: '#718096', fontSize: 12, marginBottom: 10, fontStyle: 'italic' },

  limitLabel: { fontSize: 14, color: '#4a5568', marginBottom: 5, marginTop: 10 },
  limitContainer: { flexDirection: 'row', marginBottom: 15 },
  limitBtn: { paddingVertical: 6, paddingHorizontal: 16, borderWidth: 1, borderColor: '#cbd5e0', borderRadius: 20, marginRight: 10 },
  limitBtnActive: { backgroundColor: '#4a5568', borderColor: '#4a5568' },
  limitText: { color: '#4a5568' },
  limitTextActive: { color: '#fff', fontWeight: 'bold' },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  submitBtn: { flex: 2, backgroundColor: '#0056b3', padding: 15, borderRadius: 8, alignItems: 'center', marginRight: 10 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  clearBtn: { flex: 1, backgroundColor: '#cbd5e0', padding: 15, borderRadius: 8, alignItems: 'center' },
  clearBtnText: { color: '#2d3748', fontSize: 16, fontWeight: 'bold' },

  globalError: { color: '#e53e3e', textAlign: 'center', marginTop: 10, fontSize: 16 },
  noResultsText: { textAlign: 'center', marginTop: 20, color: '#718096', fontSize: 16 },
  
  listContainer: { paddingBottom: 30 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 12, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d3748', marginBottom: 4 },
  cardSub: { fontSize: 14, color: '#4a5568', marginBottom: 2 },
  
  detailsBox: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  detailText: { fontSize: 13, color: '#718096', marginBottom: 3 },
});