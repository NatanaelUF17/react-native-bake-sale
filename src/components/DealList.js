import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import DealItem from './DealItem';

const DealList = ({ items, onDealPress }) => {
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <DealItem deal={item} onDealPress={onDealPress} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#eee',
    width: '100%',
  },
});

export default DealList;
