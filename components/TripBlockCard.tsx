import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Calendar, Clock, Trash2, Plus, MessageSquare, Map as MapIcon, List as ListIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import L from 'leaflet';

import type { Adventure, TripBlock } from '@/types/adventure';
import CompactTripCard from './CompactTripCard';

let MapContainer: any, TileLayer: any, Marker: any, Popup: any;
if (typeof window !== 'undefined' && Platform.OS === 'web') {
  ({ MapContainer, TileLayer, Marker, Popup } = require('react-leaflet'));
  require('leaflet/dist/leaflet.css');
}

// Custom Leaflet pinpoint icon
const pinIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface TripBlockCardProps {
  tripBlock: TripBlock;
  Colors: any;
  onPressTrip: (id: string) => void;
  onRemoveTrip: (id: string) => void;
  onEditTripBlock: (id: string) => void;
  onDeleteTripBlock: (id: string) => void;
  onAddAdventure: (tripBlockId: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  getTripTypeIcon: (type: string, options?: { size?: number; color?: string; style?: object }) => JSX.Element | null;
  formatUTCDate: (isoDate: string) => string;
  isCompactMode?: boolean;
}

const TripBlockCard = (props: TripBlockCardProps) => {
  const {
    tripBlock,
    Colors,
    onPressTrip,
    onRemoveTrip,
    onEditTripBlock,
    onDeleteTripBlock,
    onAddAdventure,
    onUpdateNotes,
    getTripTypeIcon,
    formatUTCDate,
    isCompactMode = false,
  } = props;

  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isNotesVisible, setIsNotesVisible] = React.useState(false);
  const [currentNotes, setCurrentNotes] = React.useState(tripBlock.notes || '');
  const [isMapView, setIsMapView] = React.useState(false);

  React.useEffect(() => {
    if (isNotesVisible) {
      setCurrentNotes(tripBlock.notes || '');
    }
  }, [isNotesVisible, tripBlock.notes]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true, friction: 7 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 7 }).start();
  };

  const toggleExpand = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setIsExpanded(!isExpanded);
  };

  // Group adventures by date and time of day
  const groupedAdventures = React.useMemo(() => {
    const groups: Record<string, Record<string, Adventure[]>> = {};
    
    tripBlock.adventures.forEach((adventure) => {
      if (!adventure.date) return;
      
      const date = formatUTCDate(adventure.date);
      if (!groups[date]) {
        groups[date] = {
          morning: [],
          afternoon: [],
          evening: [],
        };
      }
      
      const timeOfDay = adventure.timeOfDay?.toLowerCase() || 'morning';
      groups[date][timeOfDay].push(adventure);
    });
    
    return groups;
  }, [tripBlock.adventures, formatUTCDate]);

  // Collect valid adventures with coordinates
  const validAdventures = tripBlock.adventures.filter(
    adv => typeof adv.latitude === 'number' && typeof adv.longitude === 'number'
  );
  // Calculate average center
  const avgLat = validAdventures.length > 0 ? validAdventures.reduce((sum, adv) => {
    const { latitude } = adv;
    return sum + (typeof latitude === 'number' ? latitude : 0);
  }, 0) / validAdventures.length : null;
  const avgLng = validAdventures.length > 0 ? validAdventures.reduce((sum, adv) => {
    const { longitude } = adv;
    return sum + (typeof longitude === 'number' ? longitude : 0);
  }, 0) / validAdventures.length : null;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: Colors.cardBackground }]}
        onPress={toggleExpand}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: Colors.text }]}>{tripBlock.name}</Text>
          <View style={styles.headerInfo}>
            {tripBlock.location && (
              <View style={styles.infoItem}>
                <MapPin size={16} color={Colors.textSecondary} />
                <Text style={[styles.infoText, { color: Colors.textSecondary }]}>
                  {tripBlock.location}
                </Text>
              </View>
            )}
            {tripBlock.startDate && (
              <View style={styles.infoItem}>
                <Calendar size={16} color={Colors.textSecondary} />
                <Text style={[styles.infoText, { color: Colors.textSecondary }]}>
                  {formatUTCDate(tripBlock.startDate)}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.headerActions}>
          {isExpanded && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={e => {
                e.stopPropagation();
                setIsMapView(v => !v);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {isMapView ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ListIcon size={18} color={Colors.textSecondary} style={{ marginRight: 6 }} />
                  <Text style={{ color: Colors.textSecondary, fontSize: 16 }}>View List</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MapIcon size={18} color={Colors.textSecondary} style={{ marginRight: 6 }} />
                  <Text style={{ color: Colors.textSecondary, fontSize: 16 }}>View Map</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setIsNotesVisible(!isNotesVisible);
              if (isNotesVisible) {
                setCurrentNotes(tripBlock.notes || '');
              }
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MessageSquare size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDeleteTripBlock(tripBlock.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash2 size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {isNotesVisible && (
        <View style={[styles.notesContainer, { backgroundColor: Colors.cardBackground }]}>
          <TextInput
            style={[styles.notesInput, { 
              color: Colors.text,
              backgroundColor: Colors.inputBackground,
            }]}
            multiline
            placeholder="Add notes about this trip..."
            placeholderTextColor={Colors.textSecondary}
            value={currentNotes}
            onChangeText={setCurrentNotes}
            textAlignVertical="top"
          />
          <View style={styles.notesActions}>
            <TouchableOpacity
              style={[styles.notesButton, { backgroundColor: Colors.iconBackground }]}
              onPress={() => {
                setCurrentNotes(tripBlock.notes || '');
                setIsNotesVisible(false);
              }}
            >
              <Text style={[styles.notesButtonText, { color: Colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.notesButton, { backgroundColor: Colors.primary }]}
              onPress={() => {
                onUpdateNotes(tripBlock.id, currentNotes);
                setIsNotesVisible(false);
              }}
            >
              <Text style={[styles.notesButtonText, { color: '#fff' }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isExpanded && isMapView && (
        <View style={[styles.content, { backgroundColor: Colors.cardBackground }]}>  
          {validAdventures.length === 0 ? (
            <View style={{ height: 300, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: Colors.textSecondary, fontSize: 16 }}>
                No adventures with valid locations to display on the map.
              </Text>
            </View>
          ) : Platform.OS === 'web' && MapContainer ? (
            <div style={{ width: '100%', height: 500, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
              <MapContainer
                center={[avgLat, avgLng]}
                zoom={13}
                style={{ width: '100%', height: 500, borderRadius: 12 }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {validAdventures.map((a) => (
                  <Marker key={a.id} position={[a.latitude, a.longitude]} icon={pinIcon}>
                    <Popup>
                      <div>
                        <strong>{a.title}</strong><br />
                        {a.date ? formatUTCDate(a.date) : ''}<br />
                        {a.timeOfDay ? (a.timeOfDay.charAt(0).toUpperCase() + a.timeOfDay.slice(1)) : ''}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          ) : (
            <View style={{ height: 300, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: Colors.textSecondary, fontSize: 16 }}>
                Map view is only available on web.
              </Text>
            </View>
          )}
        </View>
      )}

      {isExpanded && !isMapView && (
        <View style={[styles.content, { backgroundColor: Colors.cardBackground }]}>  
          {Object.entries(groupedAdventures).map(([date, timeGroups]) => (
            <View key={date} style={styles.dayGroup}>
              <Text style={[styles.dateHeader, { color: Colors.text }]}>{date}</Text>
              {['morning', 'afternoon', 'evening'].map((timeOfDay) => (
                timeGroups[timeOfDay].length > 0 && (
                  <View key={timeOfDay} style={styles.timeGroup}>
                    <View style={styles.timeHeader}>
                      <Clock size={16} color={Colors.textSecondary} />
                      <Text style={[styles.timeHeaderText, { color: Colors.textSecondary }]}> {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} </Text>
                    </View>
                    {timeGroups[timeOfDay].map((adventure) => (
                      <CompactTripCard
                        key={adventure.id}
                        item={adventure}
                        Colors={Colors}
                        onPressTrip={onPressTrip}
                        onRemoveTrip={onRemoveTrip}
                        getTripTypeIcon={getTripTypeIcon}
                        variant="saved"
                      />
                    ))}
                  </View>
                )
              ))}
            </View>
          ))}
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: Colors.primary }]}
            onPress={() => onAddAdventure(tripBlock.id)}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Adventure</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  dayGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  timeGroup: {
    marginBottom: 16,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeHeaderText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  notesContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  notesInput: {
    height: 100,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  notesActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  notesButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  notesButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TripBlockCard; 