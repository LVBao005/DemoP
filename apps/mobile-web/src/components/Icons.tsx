import React from 'react';
import { Text, StyleSheet } from 'react-native';

const ICON_MAP: Record<string, string> = {
  'home': '🏠',
  'home-outline': '⌂',
  'images': '🖼️',
  'images-outline': '📸',
  'wallet': '👛',
  'wallet-outline': '💳',
  'person': '👤',
  'person-outline': '👤',
  'add': '＋',
  'notifications-outline': '🔔',
  'flash': '⚡',
  'close': '✕',
  'pencil': '✏️',
  'search-outline': '🔍',
  'close-circle': '⊗',
  'arrow-down': '↓',
  'cash-outline': '💵',
  'card-outline': '💳',
  'phone-portrait-outline': '📱',
  'eye-outline': '👁️',
  'eye-off-outline': '👁️‍🗨️',
  'globe-outline': '🌐',
  'moon-outline': '🌙',
  'shield-checkmark-outline': '🛡️',
  'chevron-forward': '›',
  'log-out-outline': '🚪',
  'trash-outline': '🗑️',
  'lock-closed-outline': '🔒',
  'mail-outline': '✉️',
  'alert-circle': '⚠️',
};

export const Ionicons: React.FC<{
  name: string;
  size?: number;
  color?: string;
  style?: any;
}> = ({ name, size = 20, color = '#000', style }) => {
  const icon = ICON_MAP[name] || '•';
  return (
    <Text
      style={[
        {
          fontSize: size * 0.9,
          color,
          textAlign: 'center',
          lineHeight: size * 1.1,
          fontFamily: 'sans-serif',
        },
        style,
      ]}
    >
      {icon}
    </Text>
  );
};

export default {
  Ionicons,
};
