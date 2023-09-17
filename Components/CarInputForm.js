    import React, { useState,useEffect } from 'react';
    import { ScrollView, View, Text , Image,Alert } from 'react-native';
    import * as ImagePicker from 'expo-image-picker';
    import { TextInput , Button  } from 'react-native-paper';
    import { useUserState } from '../src/Slices/userSlice.js'
    import Axios from 'axios';
    import {BACKEND} from '../CONSTANTS.js'
    export default function CarForm({navigation}) {
        const userState = useUserState()
        const [loading,setLoading] = useState(false)
        useEffect(() => {
            // Request permission to access the device's gallery
            (async () => {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                alert('Sorry, we need gallery access permissions to select images.');
              }
            })();
          }, []);
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: '',
        mileage: '',
        price: '',
        description: '',
        condition: '',
        fuelType: '',
        location: '',
        seller: '',
        images: [],
    });

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };
    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (!result.canceled) {
          // Read the image data and convert it to base64
          const imageUri = result.uri;
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onload = () => {
            const base64Data = reader.result.split(",")[1]; // Get the base64 data
            setFormData({ ...formData, images: [...formData.images, base64Data] });
          };
          reader.readAsDataURL(blob);
        }
      };
    
      const renderSelectedImages = () => {
        return formData.images.map((imageData, index) => (
          <Image
            key={index}
            source={{ uri: `data:image/jpeg;base64,${imageData}` }} // Add the data URI prefix
            style={{ width: 100, height: 100, margin: 5 }}
          />
        ));
      };
      
    
    
        const handleSubmit = async (e) => {
            // Implement your submit logic here
            e.preventDefault();
            if(formData.images.length===0){
              Alert.alert("Please select atleast one image")
              return
            }
            if(formData.make==="" || formData.model==="" || formData.year==="" || formData.mileage==="" || formData.price==="" || formData.description==="" || formData.condition==="" || formData.fuelType==="" || formData.location===""){
              Alert.alert("Please fill all the fields")
              return
            }
            
            try {
              formData.seller = userState.id;
              console.log('Form data submitted:', formData);
              setLoading(true);
              Axios.post(`${BACKEND}/car/create-car`, formData) // Use backticks for string interpolation
                .then((res) => {
                  if (res.status === 201) {
                    console.log('Car Created');
                    Alert.alert('Car Added successfully');
                    navigation.navigate('Home');
                  } else {
                    console.log(res);
                    Alert.alert('Error');
                  }
                })
                .catch((err) => {
                  console.log(err);
                }).finally(()=>{
                  setLoading(false);
                }
                );
            } catch (err) {
              console.log(err);
            }
          };
          

    return (
        <ScrollView style={{ padding: 10 }}>
        <Text style={{ fontSize: 24, marginBottom: 16 }}>Car Information</Text>
        <TextInput
            label="Make"
            value={formData.make}
            onChangeText={(text) => handleInputChange('make', text)}
        />
        <TextInput
            label="Model"
            value={formData.model}
            onChangeText={(text) => handleInputChange('model', text)}
        />
        <TextInput
            label="Year"
            value={formData.year}
            onChangeText={(text) => handleInputChange('year', text)}
        />
        <TextInput
            label="Mileage"
            value={formData.mileage}
            onChangeText={(text) => handleInputChange('mileage', text)}
        />
        <TextInput
            label="Price"
            value={formData.price}
            onChangeText={(text) => handleInputChange('price', text)}
        />
        <TextInput
            label="Description"
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            multiline
            numberOfLines={4}
        />
        <TextInput
            label="Condition"
            value={formData.condition}
            onChangeText={(text) => handleInputChange('condition', text)}
        />
        <TextInput
            label="Fuel Type"
            value={formData.fuelType}
            onChangeText={(text) => handleInputChange('fuelType', text)}
        />
        <TextInput
            label="Location"
            value={formData.location}
            onChangeText={(text) => handleInputChange('location', text)}
        />

        {/* <Text style={{ fontSize: 24, marginVertical: 16 }}>Contact Information</Text>
        <TextInput
            label="Contact Name"
            value={formData.contactName}
            onChangeText={(text) => handleInputChange('contactName', text)}
        />
        <TextInput
            label="Contact Email"
            value={formData.contactEmail}
            onChangeText={(text) => handleInputChange('contactEmail', text)}
        />
        <TextInput
            label="Contact Phone"
            value={formData.contactPhone}
            onChangeText={(text) => handleInputChange('contactPhone', text)}
        /> */}
        <Text style={{ fontSize: 24, marginVertical: 16 }}>Select Images</Text>
      <Button
        mode="contained"
        onPress={handleImageSelection}
      >
        Select Images
      </Button>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {renderSelectedImages()}
      </View>
        

        <Button
            mode="contained"
            onPress={(e)=>handleSubmit(e)}
            style={{ marginTop: 16 }}
            loading={loading}
        >
            Submit
        </Button>
        </ScrollView>
    );
    }
