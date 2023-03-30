import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { setDoc, getFirestore, collection, addDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import app from '../config/config';
import { useState, useEffect, useRef } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";


export function ChatScreen({ navigation, route }) {

    const storage = getStorage(app);
    const db = getFirestore(app);

    const [Flatlistdata, setFlatlistdata] = useState([])
    const flatRef = useRef()
    const [loading, setLoading] = useState(false)
    const [Msg, setMsg] = useState("")

    const { key, otheruserdata } = route.params

    const CustomActivityIndicator = () => {
        return (
            <View style={{
                flex: 1, position: 'absolute', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', backgroundColor: '#555555DD'
            }}>
                <ActivityIndicator color="#FFFFFF" size="large" />
            </View>
        );
    };

    const chatstarted = async () => {

        try {
            const doc = await addDoc(collection(db, key), {
                msg: Msg,
                msgFrom: getAuth().currentUser.email,
                localtime: new Date().toLocaleString([], { hour12: true }),
                createdAt: serverTimestamp()
            });
            setMsg("")
        } catch (e) {
            console.log(e)

        }
    }

    useEffect(() => {
        if (key != "1") {
            const q = query(collection(db, key), orderBy("createdAt", 'desc'))
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const chat = [];
                querySnapshot.forEach((doc) => {
                    chat.push(doc.data());
                    //console.log(doc.data())
                });
                setLoading(false)
                setFlatlistdata(chat)
            });
        }

    }, [])

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        // setModalVisible2(!modalVisible2)
        // setloading(true)

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        //  console.log(result);

        if (!result.canceled) {

        //    console.log(result.assets[0].uri)
            sendimagepicker(result.assets[0].uri)

        }

        if (result.canceled) {
            // setloading(false)
            setLoading(false)
        }
    };

    const sendimagepicker = async (img) => {
        try {
            const doc = await addDoc(collection(db, key), {
                msg: "",
                msgFrom: getAuth().currentUser.email,
                createdAt: serverTimestamp(),
                sentimage: img
            });
            setMsg("")
        } catch (e) {
            console.log(e)

        }
        setLoading(false)
    }

    const changedp = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        //  console.log(result);

        if (!result.canceled) {

            //   console.log(result.assets[0].uri)
            uploadimage(result.assets[0].uri)

        }

        if (result.canceled) {
            // setloading(false)
            setLoading(false)
        }
    }

    const uploadimage = async (resultimage) => {

        // convert image to blob image
        const blobImage = await new Promise((resole, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resole(xhr.response);
            };

            xhr.onerror = function () {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", resultimage, true);
            xhr.send(null);
        });


        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: 'image/jpeg'
        };

        //upload image to firestore
        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'ProfileImages/' + getAuth().currentUser.email + '.dp');
        const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {

                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        console.log(error.code)
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        console.log(error.code)
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        console.log(error.code)
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL)
                    updateprofiledp(downloadURL)
                });
            }
        );
    }

    const updateprofiledp = async (url) => {
        const updatedp = doc(db, "Profiles", getAuth().currentUser.email);

        // Set the "capital" field of the city 'DC'
        await updateDoc(updatedp, {
            dp: url
        });
        setProfileimageurl(url)
    }





    return (
        <View style={[styless.centeredView, { marginTop: 40 }]}>
            <View style={{ height: 50, width: '90%', flexDirection: 'row', marginLeft: 20, alignItems: 'center', marginBottom: 10 }}>
                <View style={{ height: 40, width: 50, alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => {navigation.goBack() }}>
                        <Image style={{ height: 35, width: 45, }} source={require('../../assets/backbtn.png')}></Image>
                    </TouchableOpacity>
                </View>
                {
                    otheruserdata.dp == null || otheruserdata.dp == undefined || otheruserdata.dp == ""
                        ?
                        <Image style={{ height: 50, width: 50, borderRadius: 25, }} source={require('../../assets/img1.png')}></Image>
                        :
                        <Image style={{ height: 50, width: 50, borderRadius: 25 }} src={otheruserdata.dp}></Image>
                }

                <Text style={{ color: 'white', fontWeight: '900', fontSize: 18, marginLeft: 10, }}>
                    {otheruserdata.firstname + " " + otheruserdata.lastname}
                </Text>
                <View style={{ height: 40, width: 40, borderColor: 'red', alignItems: 'center', position: 'absolute', right: 10, top: 15 }}>
                    <TouchableOpacity>
                        <Image style={{ height: 30, width: 40, }} source={require('../../assets/phone.png')}></Image>
                    </TouchableOpacity>
                </View>


            </View>
            <View style={styless.modalView}>

                <View style={{ overflow: 'hidden', height: '90%' }}>
                    <FlatList
                        showsVerticalScrollIndicator={false} style={{ marginTop: 10, }}
                        data={Flatlistdata}
                        ref={flatRef}
                        inverted
                        renderItem={({ item }) => {
                            return (
                                key != null || key != undefined ?
                                    <View style={getAuth().currentUser.email == item.msgFrom ?

                                        {
                                            backgroundColor: '#6148B459',
                                            width: '50%',
                                            padding: 10,
                                            margin: 5,

                                            alignSelf: 'flex-end',
                                            borderTopLeftRadius: 22,
                                            borderBottomLeftRadius: 22,
                                            borderBottomRightRadius: 22,


                                        }
                                        :
                                        {
                                            backgroundColor: '#E0E0E0',
                                            width: '50%',
                                            padding: 10,
                                            margin: 5,
                                            borderTopRightRadius: 22,
                                            borderBottomLeftRadius: 22,
                                            borderBottomRightRadius: 22,
                                        }
                                    }>
                                        {getAuth().currentUser.email == item.msgFrom ?
                                            <Text style={{ fontWeight: 'bold' }}
                                            >You</Text>
                                            :
                                            <Text style={{ fontWeight: 'bold' }}
                                            >{item.msgFrom}</Text>
                                        }
                                        <Text style={{ fontWeight: 'normal' }}>{item.msg}</Text>
                                        {item.sentimage == null || item.sentimage == undefined ? null :
                                            <Image style={{ height: 160, width: 160, marginBottom: 10, alignSelf: 'center' }} src={item.sentimage}></Image>}
                                        {item.createdAt != undefined ? <Text style={{ fontSize: 10, color: 'black' }}>{
                                            item.localtime
                                        }</Text> : null}
                                    </View>
                                    : null
                            )
                        }
                        }
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15, }}>
                        <View style={{ height: 50, width: '82%', borderRadius: 29, backgroundColor: '#EEEEEE', elevation: 3, flexDirection: 'row', alignItems: 'center', }}>
                            <View style={{ margin: 15, width: '71%', flexDirection: 'row', height: 30, }}>
                                <TextInput placeholder='Message'
                                    multiline={true}
                                    style={{ fontSize: 18, color: '#999999', marginLeft: 10, width: '70%', }}
                                    value={Msg}
                                    onChangeText={(val) => { setMsg(val) }}></TextInput>

                            </View>
                            <View style={{ height: 39, width: 38, marginLeft: 10, marginTop: 4 }}>
                                <TouchableOpacity onPress={() => {
                                    setLoading(true)
                                    pickImage()
                                }}>
                                    <Image style={{ height: 35, width: 35, }} source={require('../../assets/camera.png')} ></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ height: 50, width: 50, borderRadius: 27, elevation: 3, margin: 7, backgroundColor: '#eeeeee', alignItems: 'center', justifyContent: 'center', }}>
                            <TouchableOpacity onPress={() => {
                                if (Msg != "") {

                                    chatstarted()
                                }
                                // console.log(Msg)
                            }}>
                                <Image style={{ height: 27, width: 27, marginLeft: 5, }} source={require('../../assets/send.png')}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styless = StyleSheet.create({
    centeredView: {

        flex: 1,
        backgroundColor: '#6148B4',
        justifyContent: 'flex-end',

    },
    modalView: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#FFFFFFEF',
        height: '93%',
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: -33,


        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    container: {
        marginTop: 20,
        flex: 1,

    },
    row: {
        padding: 15,
        marginBottom: 5,
        backgroundColor: '#E4E3E3EF',
        flexDirection: 'column',
        borderRadius: 25,
    },
});