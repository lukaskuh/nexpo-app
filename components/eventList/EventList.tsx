import React from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';

import { ListedEvent } from '../../api/events';
import { EventListItem } from './EventListItem';

type EventListProps = {
  events: ListedEvent[] | null;
  bookedEvents: ListedEvent[] | null;
  onPress: (id: number) => void;
}

const { width, height } = Dimensions.get('window')

export const EventList = ({ events, bookedEvents, onPress }: EventListProps) => 
  <FlatList
    showsVerticalScrollIndicator={false}
    data={events}
    keyExtractor={({ id }) => id.toString()}
    renderItem={({ item: event }) => 
      <View style={styles.eventBox}>
        <EventListItem
          event={event} 
          booked={bookedEvents != null && bookedEvents.includes(event)}
          onPress={() => onPress(event.id)} />
      </View>
    }
  />

  const styles = StyleSheet.create({
    eventBox: {
      width: width * 0.85,
      height: height * 0.24
    },
  });
