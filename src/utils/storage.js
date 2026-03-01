import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const STORAGE_KEY = '@vault_items';

// 1. The Image Saver: Moves photos from temporary cache to permanent offline storage
export async function saveImageToVault(tempUri) {
  if (!tempUri) return null;

  try {
    // Generate a unique filename using the current timestamp
    const extension = tempUri.split('.').pop();
    const fileName = `vault_img_${Date.now()}.${extension}`;
    const permanentUri = FileSystem.documentDirectory + fileName;

    // Copy the photo from the temporary camera cache into the permanent Vault
    await FileSystem.copyAsync({
      from: tempUri,
      to: permanentUri,
    });

    return permanentUri;
  } catch (error) {
    console.error("Failed to secure image in the vault:", error);
    return null;
  }
}

// 2. Load all saved items on boot
export async function loadItems() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading from vault:", error);
    return [];
  }
}

// 3. Save the updated list back to the database
export async function saveItems(items) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error locking vault:", error);
  }
}
