import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { saveImageToVault } from '../utils/storage';
import { globalStyles, colors } from '../styles/theme';

export default function AddItemForm({ onAdd }) {
  const [name, setName] = useState('');
  const [tempImageUri, setTempImageUri] = useState(null);
  const [warrantyDate, setWarrantyDate] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. The Camera Trigger
  const openCamera = async () => {
    // Ask Apple for permission first
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('We need camera permissions to scan your receipt!');
      return;
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // Lets the user crop out the table/background
      quality: 0.7,        // Keeps the app fast and saves their storage space
    });

    // If they didn't hit cancel, save the temporary image preview
    if (!result.canceled) {
      setTempImageUri(result.assets[0].uri);
    }
  };

  // 2. The Locking Mechanism
  const handleSubmit = async () => {
    if (!name) {
      alert("Please enter an item name (e.g., MacBook Pro)");
      return;
    }

    setIsProcessing(true);

    // Call our Vault Engine to move the photo into offline storage
    let permanentUri = null;
    if (tempImageUri) {
      permanentUri = await saveImageToVault(tempImageUri);
    }

    // Package it up and send it to the main App
    onAdd({
      id: Date.now().toString(),
      name: name,
      warrantyDate: warrantyDate.toISOString(),
      receiptUri: permanentUri,
    });

    // Reset the form for the next item
    setName('');
    setTempImageUri(null);
    setWarrantyDate(new Date());
    setIsProcessing(false);
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={globalStyles.input}
        placeholder="Item Name (e.g., Sony OLED TV)"
        placeholderTextColor={colors.textMuted}
        value={name}
        onChangeText={setName}
      />

      <View style={styles.dateRow}>
        <Text style={styles.label}>Warranty Expires:</Text>
        <DateTimePicker
          value={warrantyDate}
          mode="date"
          display="compact"
          onChange={(event, selectedDate) => {
            if (selectedDate) setWarrantyDate(selectedDate);
          }}
          themeVariant="dark"
        />
      </View>

      <TouchableOpacity style={globalStyles.imageButton} onPress={openCamera}>
        <Text style={styles.imageButtonText}>
          {tempImageUri ? '📸 Retake Photo' : '📸 Snap Receipt / Serial'}
        </Text>
      </TouchableOpacity>

      {/* Show a slick preview of the receipt if they took one */}
      {tempImageUri && (
        <Image source={{ uri: tempImageUri }} style={styles.previewImage} />
      )}

      <TouchableOpacity
        style={[globalStyles.buttonPrimary, isProcessing && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={isProcessing}
      >
        {isProcessing ? <ActivityIndicator color="#FFF" /> : 'Lock It In'}
      </TouchableOpacity>
    </View>
  );
}