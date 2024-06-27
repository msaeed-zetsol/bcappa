import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../../constants';

const RailSelected = () => <View style={styles.root} />;

export default memo(RailSelected);

const styles = StyleSheet.create({
  root: {
    height: 5,
    backgroundColor: Colors.PRIMARY_COLOR,
    borderRadius: 2,
  },
});

