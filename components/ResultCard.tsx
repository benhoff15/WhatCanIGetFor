import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Image } from 'react-native';
import {
  MapPin,
  CalendarDays,
  Clock,
  Users,
  Heart,
  Share2,
  Plane,
  BedDouble,
  Utensils,
  Compass,
  Image as ImageIcon,
} from 'lucide-react-native';

import type { Adventure } from '@/types/adventure';

interface ResultCardProps {
  item: Adventure;
  Colors: any;
  onPressItem: (id: string) => void;
  onSaveItem: (item: Adventure) => void;
  isSaved: boolean;
  getTripTypeIcon: (type: string, options?: { size?: number; color?: string; style?: object }) => JSX.Element | null;
  formatUTCDate: (isoDate: string) => string;
  getCategoryTagColor: (type: string) => string;
  index?: number;
}

const ResultCard = (props: ResultCardProps) => {
  const {
    item,
    Colors,
    onPressItem,
    onSaveItem,
    isSaved,
    getTripTypeIcon,
    formatUTCDate,
    getCategoryTagColor,
    index // Destructure index
  } = props;

  const componentStyles = styles(Colors);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScaleAnim = useRef(new Animated.Value(1)).current;
  const shareScaleAnim = useRef(new Animated.Value(1)).current;
  const borderOpacityAnim = useRef(new Animated.Value(0)).current;
  const [isCardHovered, setIsCardHovered] = useState(false);

  const entranceOpacity = useRef(new Animated.Value(0)).current;
  const entranceTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceOpacity, {
        toValue: 1,
        duration: 400,
        delay: (index || 0) * 100,
        useNativeDriver: true,
      }),
      Animated.spring(entranceTranslateY, {
        toValue: 0,
        friction: 7,
        tension: 60,
        delay: (index || 0) * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: Platform.OS !== 'web', friction: 7 }).start();
    if (Platform.OS !== 'web') {
      Animated.timing(borderOpacityAnim, { toValue: 1, duration: 100, useNativeDriver: false }).start();
    }
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: Platform.OS !== 'web', friction: 7 }).start();
    if (Platform.OS !== 'web') {
      Animated.timing(borderOpacityAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    }
  };

  const handleMouseEnter = () => {
    if (Platform.OS === 'web') {
      setIsCardHovered(true);
      Animated.timing(borderOpacityAnim, { toValue: 1, duration: 150, useNativeDriver: false }).start();
    }
  };

  const handleMouseLeave = () => {
    if (Platform.OS === 'web') {
      setIsCardHovered(false);
      Animated.timing(borderOpacityAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();
    }
  };

  const handleToggleFavorite = () => {
    onSaveItem(item);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Animated.sequence([
      Animated.timing(heartScaleAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(heartScaleAnim, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();
  };

  const handleShare = async () => {
    Animated.sequence([
      Animated.timing(shareScaleAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(shareScaleAnim, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();

    try {
      await Share.share({
        message: `Check out this adventure: ${item.title} - Found on WhatCanIGetFor!`,
        // url: item.url // To do later
      });
    } catch (error) {
      // console.error('Error sharing:', error);
    }
  };

  return (
    <Animated.View
      style={[
        componentStyles.cardWrapperForBorder,
        {
          opacity: entranceOpacity,
          transform: [{ translateY: entranceTranslateY }],
        },
      ]}
      {...(Platform.OS === 'web' ? { 
          onMouseEnter: handleMouseEnter, 
          onMouseLeave: handleMouseLeave 
        } : {})}
    >
      <Animated.View style={[componentStyles.gradientBorder, { opacity: borderOpacityAnim }]}>
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          style={componentStyles.gradientFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      <Animated.View style={[componentStyles.card, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          onPress={() => onPressItem(item.id)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          accessibilityLabel={`View details for ${item.title}`}
        >
          <View style={componentStyles.thumbnailPlaceholder}>
            {item.imageUrl ? (
               <Image
                source={{ uri: item.imageUrl }}
                style={[StyleSheet.absoluteFill, { height: '100%' }]}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={[Colors.background, Colors.iconBackground]}
                style={[StyleSheet.absoluteFill, { borderRadius: componentStyles.thumbnailPlaceholder.borderRadius }]}
              />
            )}
            {!item.imageUrl && getTripTypeIcon(item.type, { size: 56, color: Colors.textSecondary + "77" })}
          </View>


          <View style={componentStyles.infoContainer}>
            <Text style={componentStyles.titleText} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
            
            <View style={componentStyles.chipClusterContainer}>
              <View style={[componentStyles.detailChip, { backgroundColor: getCategoryTagColor(item.type) }]}>
                <View style={componentStyles.iconTextContainer}>
                  {getTripTypeIcon(item.type, { size: 16, color: Colors.text /* Assuming good contrast */ })}
                  <Text style={[componentStyles.cardSubtitle, {color: Colors.text /* Assuming good contrast */}]}>
                    {item.type?.charAt(0).toUpperCase() + item.type?.slice(1)}
                  </Text>
                </View>
              </View>

              {item.location && (
                <View style={componentStyles.detailChip}>
                  <View style={componentStyles.iconTextContainer}>
                    <MapPin size={16} color={Colors.textSecondary} style={componentStyles.subtitleIcon} />
                    <Text style={componentStyles.cardSubtitle} numberOfLines={1} ellipsizeMode="tail">{item.location}</Text>
                  </View>
                </View>
              )}

              {item.date && (
                <View style={componentStyles.detailChip}>
                  <View style={componentStyles.iconTextContainer}>
                    <CalendarDays size={16} color={Colors.textSecondary} style={componentStyles.subtitleIcon} />
                    <Text style={componentStyles.cardSubtitle}>{formatUTCDate(item.date)}</Text>
                  </View>
                </View>
              )}
              
              {item.timeOfDay && (
                <View style={componentStyles.detailChip}>
                  <View style={componentStyles.iconTextContainer}>
                    <Clock size={16} color={Colors.textSecondary} style={componentStyles.subtitleIcon} />
                    <Text style={componentStyles.cardSubtitle}>
                      {item.timeOfDay.charAt(0).toUpperCase() + item.timeOfDay.slice(1)}
                    </Text>
                  </View>
                </View>
              )}

              {item.groupSize && (
                <View style={componentStyles.detailChip}>
                  <View style={componentStyles.iconTextContainer}>
                    <Users size={16} color={Colors.textSecondary} style={componentStyles.subtitleIcon} />
                    <Text style={componentStyles.cardSubtitle}>{item.groupSize}</Text>
                  </View>
                </View>
              )}
            </View>
            
            <Text style={componentStyles.priceText}>${item.price}</Text>
          </View>

          <View style={componentStyles.actionsContainer}>
            <TouchableOpacity 
              onPress={handleToggleFavorite} 
              style={componentStyles.actionButton}
              accessibilityLabel={isSaved ? `Unsave ${item.title}` : `Save ${item.title}`}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
                <Heart size={22} color={isSaved ? Colors.primary : Colors.textSecondary} fill={isSaved ? Colors.primary : 'none'} />
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleShare} 
              style={componentStyles.actionButton} 
              accessibilityLabel={`Share ${item.title}`}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Animated.View style={{ transform: [{ scale: shareScaleAnim }] }}>
                <Share2 size={22} color={Colors.textSecondary} />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View> 
  );
};

const styles = (Colors: any) => StyleSheet.create({
  cardWrapperForBorder: {
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    position: 'relative',
  },
  gradientBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18,
    zIndex: 0,
  },
  gradientFill: {
    flex: 1,
    borderRadius: 16,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    zIndex: 1,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  thumbnailPlaceholder: {
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: Colors.iconBackground,
  },
  infoContainer: {
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flexShrink: 1,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 8,
  },
  chipClusterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 8,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.iconBackground,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  iconTextContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSubtitle: { 
    fontSize: 14,
    color: Colors.textSecondary,
  },
  subtitleIcon: { 
    marginRight: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    marginTop: 12,
  },
  actionButton: {
    marginLeft: 16,
    padding: 6,
  },
});

export default ResultCard;