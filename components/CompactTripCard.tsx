import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import {
  Heart,
  Trash2,
  Plane,
  BedDouble,
  Utensils,
  Compass,
  Image as ImageIcon, 
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import type { Adventure } from '@/types/adventure';

interface CompactTripCardProps {
  item: Adventure;
  onPressTrip: (id: string) => void;
  onRemoveTrip?: (id: string) => void;
  onShareTrip?: (id: string) => void;
  getTripTypeIcon: (type: string, options?: { size?: number; color?: string; style?: object }) => JSX.Element | null;
  Colors: any;
  variant?: "saved" | "results";
}

const CompactTripCard = (props: CompactTripCardProps) => {
  const {
    item,
    onPressTrip,
    onRemoveTrip,
    onShareTrip,
    getTripTypeIcon,
    Colors,
    variant = "saved"
  } = props;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScaleAnim = useRef(new Animated.Value(1)).current;
  const [isFavorited, setIsFavorited] = useState(false);

  const handlePressInCard = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, friction: 7 }).start();
  };

  const handlePressOutCard = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 7 }).start();
  };

  const handleToggleFavorite = () => {
    setIsFavorited(prev => !prev);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    Animated.sequence([
      Animated.timing(heartScaleAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(heartScaleAnim, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();
  };

  return (
    <Animated.View style={[styles(Colors).cardContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={() => {
          if (Platform.OS !== "web") Haptics.selectionAsync();
          onPressTrip(item.id);
        }}
        onPressIn={handlePressInCard}
        onPressOut={handlePressOutCard}
        activeOpacity={0.9}
        accessibilityLabel={`View details for ${item.title}`}
      >
        <View style={styles(Colors).innerContainer}>
          <View style={styles(Colors).thumbnailSection}>
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: 48, height: 48, borderRadius: 8 }}
              resizeMode="contain"
            />
          </View>

          <View style={styles(Colors).infoSection}>
            <Text style={styles(Colors).titleText} numberOfLines={1} ellipsizeMode="tail">
              {item.title}
            </Text>
            <View style={styles(Colors).subtitleRow}>
              {getTripTypeIcon(item.type, { size: 14, color: Colors.textSecondary, style: { marginRight: 4 } })}
              <Text style={styles(Colors).priceText}>${item.price}</Text>
            </View>
          </View>

          <View style={styles(Colors).actionsSection}>
            {/* Save toggle (always shown) */}
            <TouchableOpacity
              onPress={handleToggleFavorite}
              accessibilityLabel={isFavorited ? `Unfavorite ${item.title}` : `Favorite ${item.title}`}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
              style={styles(Colors).actionButton}
            >
              <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
                <Heart
                  size={20}
                  color={Colors.primary}
                  fill={isFavorited ? Colors.primary : "none"}
                />
              </Animated.View>
            </TouchableOpacity>

            {/* Only show in 'saved' variant */}
            {variant === "saved" && onRemoveTrip && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onRemoveTrip(item.id);
                }}
                accessibilityLabel={`Delete ${item.title}`}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
                style={styles(Colors).actionButton}
              >
                <Trash2 size={20} color={Colors.error} />
              </TouchableOpacity>
            )}

            {/* Only show in 'results' variant */}
            {variant === "results" && onShareTrip && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onShareTrip(item.id);
                }}
                accessibilityLabel={`Share ${item.title}`}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
                style={styles(Colors).actionButton}
              >
                <Compass size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = (Colors: any) => StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  thumbnailSection: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.iconBackground,
    overflow: 'hidden',
  },
  infoSection: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  }
});

export default CompactTripCard;