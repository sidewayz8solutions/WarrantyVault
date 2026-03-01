import { StyleSheet } from 'react-native';

// The Vault Color Palette
export const colors = {
  background: '#09090B', // Deep, pitch black for OLED screens
  card: '#1C1C1E',       // Raised dark gray for items and forms
  text: '#FFFFFF',       // Crisp white
  textMuted: '#8E8E93',  // iOS standard gray for subtitles
  accent: '#0A84FF',     // Trustworthy iOS Blue
  danger: '#FF453A',     // iOS Red for delete buttons
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: colors.accent,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  imageButton: {
    backgroundColor: '#2C2C2E',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    borderStyle: 'dashed',
  }
});
