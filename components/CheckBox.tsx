import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomCheckBoxProps{
    stateVal : boolean;
    stateFunc : (val:boolean)=>void;
    title:string
}

const CustomCheckbox:React.FC<CustomCheckBoxProps> = ({ stateVal, stateFunc,title="" }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.checkbox, stateVal && styles.checked]}
        onPress={() => stateFunc(!stateVal)} // controlled toggle
      >
        {stateVal && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      <Text style={styles.label}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#333',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
  },
});

export default CustomCheckbox;
