import React, { useState } from 'react';
import { Keyboard, Text, View, TextInput, Button, Image, TouchableWithoutFeedback, Alert, ScrollView, StyleSheet, Slider, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
class homeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            images: [
                require('../assets/style_images/africa.jpg'),
                require('../assets/style_images/aquarelle.jpg'),
                require('../assets/style_images/bango.jpg'),
                require('../assets/style_images/chinese_style.jpg'),
                require('../assets/style_images/hampson.jpg'),
                require('../assets/style_images/la_muse.jpg'),
                require('../assets/style_images/rain_princess.jpg'),
                require('../assets/style_images/the_scream.jpg'),
                require('../assets/style_images/the_shipwreck_of_the_minotaur.jpg'),
                require('../assets/style_images/udnie.jpg'),
                require('../assets/style_images/wave.jpg'),
            ],
            image: null,
            content_image: "",
            styledImage:""
        }
    }
    change(value) {
        console.log(value)
        this.setState({ value: value })
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.android) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    getStyleImage(value) {
        if (value == 0) {
            return "africa";
        }
        else if (value == 1) {
            return "aquarelle";
        }
        else if (value == 2) {
            return "bango";
        }
        else if (value == 3) {
            return "chinese_style";
        }
        else if (value == 4) {
            return "hampson";
        }
        else if (value == 5) {
            return "la_muse";
        }
        else if (value == 6) {
            return "rain_princess";
        }
        else if (value == 7) {
            return "the_scream";
        }
        else if (value == 8) {
            return "the_shipwreck_of_the_minotaur";
        }
        else if (value == 9) {
            return "udnie";
        }
        else if (value == 10) {
            return "wave";
        }
    }
    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });
        console.log("data")
        // console.log(result.base64
        console.log(this.state.value);
        console.log(this.state.images[0]);

        if (!result.cancelled) {
            this.setState({ content_image: result.base64 });
            this.setState({ image: result.uri });

            console.log(this.state.content_image)
        }

        // this.postReqData(result);
    };

    postReqData = async ()=> {
       console.log("post data");
        let data = {
            content_image : this.state.content_image,
            style_image : this.getStyleImage(this.state.value)
        }
        console.log(data);
        data = JSON.stringify(data)
        // formData.append('text',)
        let res =  await fetch('http://192.168.43.70:8000/styleTransfer/getStyleImage/', {
            method: 'POST',
            body: data,
            headers: {
                'content-type': 'multipart/form-data',
            },
        });

        res = await res.json();
        res = JSON.parse(res)
        console.log("hello")
        // str = res["style_image"]
        let final_image = res["style_image"].substring(1,)
        console.log(final_image)
        this.setState({styledImage:final_image});
       

        
    }

    render() {
        let encodedData = this.state.styledImage;
        console.log("phase 1")
        console.log(typeof(encodedData))
        encodedData = encodedData.substring(1,encodedData.length-2)
        console.log("phase 2")
        var base64Icon = 'data:image/jpg;base64,'+ encodedData;
        console.log(base64Icon);
        return (
            <ScrollView>
                <View style={styles.container}>


                    <Slider
                        step={1}
                        maximumValue={10}
                        minimumValue={0}
                        onValueChange={this.change.bind(this)}
                        value={this.state.value}
                    />
                    <View style={{ margin: 5 }}></View>
                    <TouchableOpacity  >

                        <Image

                            // source ={require('/home/manan/SIH/SIH-/App-UI/assets/homeImages/overlayed/awifs_ndvi_'+ this.fromIToImage(value) +'_clipped.jpg')}
                            source={this.state.images[this.state.value]}
                            style={{ width: 400, height: 400 }}
                        />
                    </TouchableOpacity>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            title="Pick an image from camera roll"
                            onPress={this._pickImage}
                        />
                        {this.state.image &&
                            <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />}
                    </View>


                    {this.state.image && <Button
                        title="submitPostRequest"
                        onPress={this.postReqData}
                    />}
                    <View>
                        {this.state.styledImage!="" && <Image style={{width: 200, height: 300,borderWidth: 1, borderColor: 'red'}} source={{uri: base64Icon}}/> }
                    </View>
                </View>

            </ScrollView>


        );
    }
}

export default homeScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 300,
        backgroundColor: 'white'
    },
})

// import * as React from 'react';
// import { Button, Image, View } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import Constants from 'expo-constants';
// import * as Permissions from 'expo-permissions';

// export default class ImagePickerExample extends React.Component {
//     state = {
//         image: null,
//     };

//     render() {
//         let { image } = this.state;

//         return (
//             <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//                 <Button
//                     title="Pick an image from camera roll"
//                     onPress={this._pickImage}
//                 />
//                 {image &&
//                     <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
//             </View>
//         );
//     }


// }