import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import TextFieldComponent from "./TextFieldComponent";
import { Fonts } from "../constants";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectModalProps {
  options: Option[];
  selectedOptions: string[];  
  onSelect: (selected: string[]) => void;
  placeholder: string;
  disabled?: boolean;
}

const MultiSelectModal: React.FC<MultiSelectModalProps> = ({
  options,
  selectedOptions = [],
  onSelect,
  placeholder,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleSelect = (option: string) => {
    if (selectedOptions.includes(option)) {
      onSelect(selectedOptions.filter((item) => item !== option));
    } else {
      onSelect([...selectedOptions, option]); 
    }
    toggleModal();
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleModal} disabled={disabled}>
        <View style={styles.button}>
          <TextFieldComponent
            value={
              selectedOptions.length > 0
                ? selectedOptions.join(", ")
                : placeholder
            }
            placeholder={placeholder}
            editable={false}
          />
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={toggleModal}
          activeOpacity={1}
        >
          <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
            <ScrollView style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  style={[
                    styles.option,
                    selectedOptions.includes(option.value) &&
                      styles.selectedOption,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedOptions.includes(option.value) &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 40,
  },
  buttonText: {
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 310,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  optionsContainer: {
    width: "100%",
  },
  option: {
    padding: 15,
    width: "100%",
 
  },
  selectedOption: {
    backgroundColor: "#f6f3f3",
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    color: "#000",
  },
});

export default MultiSelectModal;
