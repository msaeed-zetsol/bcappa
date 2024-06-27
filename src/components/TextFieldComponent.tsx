// import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {Input, Text} from 'native-base';
import {Fonts} from '../constants';

interface fieldValues {
  placeholder?: string;
  width?: string;
  keyboardType?: any;
  onChange?: (text: string) => void;
  onBlur?: () => any;
  value?: any;
  InputRightElement?: any;
  InputLeftElement?: any;
  type?: any;
  editable?: boolean;
  readOnly?: boolean;
  ref?: any;
  onSubmitEditing?: () => any;
  onEndEditing?: () => any;
  style?: any;
}

const TextFieldComponent = ({
  placeholder,
  width,
  keyboardType,
  onChange,
  onBlur,
  onSubmitEditing,
  onEndEditing,
  value,
  InputRightElement,
  InputLeftElement,
  type,
  editable,
  readOnly,
  ref,
  style,
}: fieldValues) => {
  return (
    <Input
      ref={ref}
      placeholder={placeholder}
      w={width ? width : '100%'}
      size="lg"
      borderRadius={16}
      p="3"
      isReadOnly={readOnly}
      pl="5"
      autoCapitalize="none"
      keyboardType={keyboardType}
      autoCorrect={false}
      onChangeText={onChange}
      onBlur={onBlur}
      onSubmitEditing={onSubmitEditing}
      onEndEditing={onEndEditing}
      value={value}
      borderColor="BORDER_COLOR"
      placeholderTextColor={'GREY'}
      color={'BLACK_COLOR'}
      fontSize={'sm'}
      fontFamily={Fonts.POPPINS_REGULAR}
      InputRightElement={InputRightElement}
      InputLeftElement={InputLeftElement}
      type={type}
      editable={editable}
      returnKeyType="next"
      style={style}
    />
  );
};

export default TextFieldComponent;

// const styles = StyleSheet.create({});
