import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StatusBar, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AddItemForm from './src/components/AddItemForm';
import { loadItems, saveItems } from './src/utils/storage';
import { globalStyles, colors } from './src/styles/theme';

export default function App() {
  const [items, setItems] = useState([]);

  // Boot up the Vault Database
  useEffect(() => {
    (async () => {
      const savedItems = await loadItems();
      setItems(savedItems);
    })();
  }, []);

  // Lock a new item in
  const handleAddItem = async (newItem) => {
    const updatedItems = [newItem, ...items];
    setItems(updatedItems);
    await saveItems(updatedItems);
  };

  // Delete an item from the Vault
  const handleDeleteItem = async (id) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to permanently remove this from the vault?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedItems = items.filter(item => item.id !== id);
            setItems(updatedItems);
            await saveItems(updatedItems);
          }
        }
      ]
    );
  };

  // Design for the individual item cards in the list
  const renderItem = ({ item }) => {
    const dateObj = new Date(item.warrantyDate);

    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDate}>Expires: {dateObj.toLocaleDateString()}</Text>
        </View>

        {/* If they snapped a receipt, show a thumbnail of it! */}
        {item.receiptUri && (
          <Image source={{ uri: item.receiptUri }} style={styles.cardImage} />
        )}

        <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>X</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      {/* Forces the iPhone clock/battery text to be white against our dark theme */}
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Text style={globalStyles.header}>WarrantyVault</Text>

      <AddItemForm onAdd={handleAddItem} />

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  itemName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDate: {
    color: colors.textMuted,
    fontSize: 14,
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  deleteBtn: {
    backgroundColor: colors.danger,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  deleteText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});