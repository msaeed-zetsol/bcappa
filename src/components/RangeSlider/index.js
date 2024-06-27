import React, {useCallback, useState} from 'react';
import {View, Text} from 'react-native';

import Label from './Label';
import Notch from './Notch';
import Rail from './Rail';
import RailSelected from './RailSelected';
import Thumb from './Thumb';
import {Fonts} from '../../constants';
import {useDispatch} from 'react-redux';
import {rangeValues} from '../../redux/user/userSlice';
import RangeSliderRN from 'rn-range-slider';
import {verticalScale} from '../../utilities/Dimensions';
const RangeSlider = ({from, to}) => {
  const dispatch = useDispatch();
  const [low, setLow] = useState(from);
  const [high, setHigh] = useState(to);
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(value => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);

  const handleValueChange = useCallback(
    (newLow, newHigh) => {
      setLow(newLow);
      setHigh(newHigh);
      dispatch(rangeValues({low: newLow, high: newHigh}));
    },
    [setLow, setHigh],
  );

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: verticalScale(10),
        }}>
        <View>
          <Text
            style={[
              {fontStyle: 'italic'},
              {textAlign: 'left', fontSize: 14, color: '#D2D2D2'},
            ]}>
            Min
          </Text>
          <Text
            style={[
              {fontFamily: Fonts.POPPINS_MEDIUM},
              {fontSize: 18, color: '#000000'},
            ]}>
            Rs {low}
          </Text>
        </View>
        <View>
          <Text
            style={[
              {fontStyle: 'italic'},
              {
                textAlign: 'right',
                fontSize: verticalScale(14),
                color: '#D2D2D2',
              },
            ]}>
            Max
          </Text>
          <Text
            style={[
              {fontFamily: Fonts.POPPINS_MEDIUM},
              {fontSize: verticalScale(18), color: '#000000'},
            ]}>
            Rs {high}
          </Text>
        </View>
      </View>
      <RangeSliderRN
        // style={styles.slider}
        min={from}
        max={to}
        step={500}
        floatingLabel
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        // renderLabel={renderLabel}
        // renderNotch={renderNotch}
        onValueChanged={handleValueChange}
      />
    </>
  );
};

export default RangeSlider;
