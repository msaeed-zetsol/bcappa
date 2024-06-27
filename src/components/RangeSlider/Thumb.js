import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../../constants';

const THUMB_RADIUS = 15;

const Thumb = () => <View style={styles.root} />;

const styles = StyleSheet.create({
  root: {
    width: THUMB_RADIUS * 1.5,
    height: THUMB_RADIUS * 1.5,
    borderRadius: THUMB_RADIUS,
    borderWidth: 6,
    borderColor: Colors.PRIMARY_COLOR,
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 0.16,
    shadowRadius: 6,
  },
});

export default memo(Thumb);
