import { useState, useEffect, useRef } from 'react';
import { Modal, Button, View, Text, TextInput, Image, TouchableOpacity, Alert, StyleSheet, FlatList, ScrollView, Touchable, ActivityIndicator } from 'react-native';
import { setDoc, getFirestore, collection, addDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import app from '../config/config';
import { getAuth, signOut } from 'firebase/auth';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import * as Contacts from 'expo-contacts';
import { Swipeable } from 'react-native-gesture-handler';
import Swipelist from 'react-native-swipeable-list-view';

//yolo man


let showname = ""
let showimage = ""
currentuserdp = ""

const extractKey = ({ number }) => number

export function Profiles({ navigation }) {

    const storage = getStorage(app);
    const db = getFirestore(app);


    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [contacts, setContacts] = useState([])
    const [error, setError] = useState(undefined)
    const [profileimageurl, setProfileimageurl] = useState()
    const [firstname, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [Msg, setMsg] = useState("")
    const [Flatlistdata, setFlatlistdata] = useState([])
    const [profilelist, setProfilelist] = useState([])
    const flatRef = useRef()
    const [comkey, setComKey] = useState("1")



    const getContactsRow = (contactdata) => {
        let info = []
        let num = []
        let j = 0
        if (contactdata !== undefined) {

            contactdata.map((contact, index) => {
                if (contact.name == undefined || contact.phoneNumbers == undefined || contact.phoneNumbers[0].number == undefined) {
                    // console.log(index)
                    // console.log("undefined found")
                }
                else {
                    for (let i = 0; i < contact.phoneNumbers.length; i++) {
                        let str = contact.phoneNumbers[i].number.replaceAll(/\s/g, '')
                        let editstr = str.replace(/-/g, "")
                        num[i] = editstr

                    }

                    if (num.length != 0 || num.length != 1) {
                        let temp = []
                        let k = 0
                        for (let i = 0; i < num.length - 1; i++) {
                            if (num[i] != num[i + 1]) {
                                temp[k++] = num[i]
                            }
                        }
                        temp[k++] = num[num.length - 1];
                        num = temp
                    }
                    info[j++] = ({ "name": contact.name, "number": num })
                    num = []
                }
            })
        }
        else {

            return <Text>Await contacts...</Text>
        }
        showavailablecontact(info)

        // console.log(info)
        //  setContacts(info)
    }

    const showavailablecontact = (contactlist) => {
        let newlist = []
        let j = 0
        let k = 0
        contactlist.map((list) => {
            let length = list.number.length
            profilelist.map((data) => {
                for (let i = 0; i < length; i++) {
                    if (list.number[i] == data.number) {
                        newlist.push({ "id": k++, "name": list.name, "number": data.number, "email": data.email, "firstname": data.firstname, "lastname": data.lastname, "dp": data.dp })
                        //   console.log(list.name)
                    }
                }
            })
        })
        setContacts(newlist)
    }


    const chatstarted = async (comkey) => {

        try {
            const doc = await addDoc(collection(db, comkey), {
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
        if (comkey != "1") {
            const q = query(collection(db, comkey), orderBy("createdAt", 'desc'))
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
        // return() => unsubscribe()
    }, [comkey])

    const fetchdata = async () => {
        setLoading(true)
        try {
            const querySnapshot = await getDocs(collection(db, "Profiles"));
            const chat = []
            querySnapshot.forEach((doc) => {
                if (doc.data().email.toLocaleLowerCase() == getAuth().currentUser.email.toLocaleLowerCase()) {
                    setProfileimageurl(doc.data().dp)
                    // console.log("our dp id is")
                    // console.log(doc.data().dp)
                }
                chat.push(doc.data())
            });
            setProfilelist(chat)

        } catch (e) {
            console.log(e)
        }
    }

    const [recentchat, setRecentchat] = useState([])

    useEffect(() => {

        setLoading(true)
        const chat1 = []

        const fetchdata = async () => {
            const querySnapshot = await getDocs(collection(db, "Profiles"));


            querySnapshot.forEach((doc) => {
                if (doc.data().email.toLocaleLowerCase() == getAuth().currentUser.email.toLocaleLowerCase()) {
                    setProfileimageurl(doc.data().dp)
                    // console.log("our dp id is")
                    // console.log(doc.data().dp)
                }
                chat1.push(doc.data())
                // console.log("ub") kia bana ubaid project khol k login krna ha wo me theek kr deta hun yar sorry wait kar le bhai 
                // console.log(doc.data())
            });
            setProfilelist(chat1)
        }

        fetchdata()


        const q = query(collection(db, "Profiles/" + getAuth().currentUser.email + "/chatcollection"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chat = []
            querySnapshot.forEach((doc) => {
                chat1.map((item) => {
                    if (item.email == doc.data().email) {
                        chat.push(item)
                        // console.log("bu")
                        // console.log(item)
                    }
                })
            });
            setRecentchat(chat)
            setLoading(false)

        })

        return () => unsubscribe()

    }, [])

    const getcontacts = async () => {

        const { status } = await Contacts.requestPermissionsAsync();

        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers],
            });



            if (data.length > 0) {
                getContactsRow(data)
            }
            else {
                setError("No contacts found")
            }
        }
        else {
            setError("Permission to access contacts denied")
        }
    }


    useEffect(() => {

        //   fetchdata()
        getcontacts()
    }, [])




    const logoutaccount = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            //  console.log('user sign out')
            navigation.goBack()
        }).catch((error) => {
            console.log(error)
        });
    }

    const CustomActivityIndicator = () => {
        return (
            <View style={{
                flex: 1, position: 'absolute', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', backgroundColor: '#555555DD'
            }}>
                <ActivityIndicator color="#FFFFFF" size="large" />
            </View>
        );
    };

    const startchat = async (otheruserdata) => {

        await setDoc(doc(db, "Profiles/" + getAuth().currentUser.email + "/chatcollection", otheruserdata.email), {
            email: otheruserdata.email,
        });

        let array = [getAuth().currentUser.email.toLocaleLowerCase(), otheruserdata.email.toLocaleLowerCase()]
        array.sort()
        let key = array[0] + "_" + array[1]
        // console.log(key)
        // console.log(otheruserdata)
        // console.log(key)
        // setModalVisible2(!modalVisible2)
        navigation.navigate("Chat", { key: key, otheruserdata: otheruserdata })
        // setComKey(key)
    }

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
            const doc = await addDoc(collection(db, comkey), {
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


    const LeftSwipeActions = () => {
        return (
            <View
                style={{ flex: 1, backgroundColor: '#ccffbd', justifyContent: 'center' }}
            >
                <Text
                    style={{
                        color: '#40394a',
                        paddingHorizontal: 10,
                        fontWeight: '600',
                        paddingHorizontal: 30,
                        paddingVertical: 20,
                    }}
                >
                    Bookmark
                </Text>
            </View>
        );
    };
    const rightSwipeActions = () => {
        return (
            <View
                style={{
                    backgroundColor: '#ff8303',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}
            >
                <Text
                    style={{
                        color: '#1b1a17',
                        paddingHorizontal: 10,
                        fontWeight: '600',
                        paddingHorizontal: 30,
                        paddingVertical: 20,
                    }}
                >
                    Delete
                </Text>
            </View>
        );
    };
    const swipeFromLeftOpen = () => {
        alert('Swipe from left');
    };
    const swipeFromRightOpen = () => {
        alert('Swipe from right');
    };

    const data = [
        {
            name: 'Javascript',
        },
        {
            name: 'React Native',
        },
        {
            name: 'Swift',
        },
    ];

    return (

        <View style={{ paddingTop: 40, height: '100%', width: '100%', backgroundColor: '#6148B4', }}>
            <View style={{ width: '100%', height: 70, marginTop: 20, marginLeft: 25, marginBottom: 30, }}>
                <TouchableOpacity style={{ width: 40, }} onPress={() => {
                    logoutaccount()
                }}>
                    <Image style={{ height: 30, width: 30 }} source={require('../../assets/menu.png')}></Image>
                </TouchableOpacity>
                <Text style={{ marginTop: 20, fontSize: 25, fontWeight: '900', color: 'white' }}>Messages</Text>



                {/* <TouchableOpacity style={{ position: 'absolute', right: 40, top: 5 }} onLongPress={() => { changedp() }}>
                    {profileimageurl == "" || profileimageurl == null || profileimageurl == undefined
                        ?
                        <Image style={{ height: 50, width: 50, }} source={require('../../assets/img5.png')}></Image>
                        :
                        <Image style={{ height: 50, width: 50, borderRadius: 30 }} src={profileimageurl}></Image>}
                </TouchableOpacity> */}
                <TouchableOpacity style={{ position: 'absolute', right: 55, top: 3 }} onLongPress={() => { changedp() }}>

                    {profileimageurl == "" || profileimageurl == null || profileimageurl == undefined
                        ?
                        <Image style={{ height: 60, width: 60 }} source={require('../../assets/img5.png')}></Image>
                        :
                        <Image style={{ height: 60, width: 60, borderRadius: 30 }} src={profileimageurl}></Image>}

                </TouchableOpacity>
            </View>

            <View style={{ borderColor: 'green', height: '90%', borderTopRightRadius: 40, overflow: 'hidden', borderTopLeftRadius: 40, backgroundColor: '#FFFFFF' }}>
                <View style={{ flexDirection: 'row', height: 90, paddingRight: 15, alignItems: 'center', marginVertical: 5, marginLeft: 9, marginTop: 40, }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', }}>
                        <TouchableOpacity >
                            <Image style={{ height: 63, width: 63, marginLeft: 25, }} source={require('../../assets/img1.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image style={{ height: 63, width: 63, marginLeft: 25, }} source={require('../../assets/img2.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image style={{ height: 63, width: 63, marginLeft: 25, }} source={require('../../assets/img3.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image style={{ height: 63, width: 63, marginLeft: 25, }} source={require('../../assets/img4.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image style={{ height: 63, width: 63, marginLeft: 25, }} source={require('../../assets/img5.png')}></Image>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <View style={{ width: 130, marginLeft: 35, marginTop: 20, }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 23, }}>Recent Chat</Text>
                </View>

                <Swipelist style={{ marginTop: 20, }}
                    data={recentchat}
                    renderRightItem={(item, index) => {
                        // console.log(index)

                        return (
                            item.email.toLocaleLowerCase() != getAuth().currentUser.email ?

                                <TouchableOpacity onPress={() => {
                                    showname = recentchat[index].firstname + " " + recentchat[index].lastname
                                    currentuserdp = recentchat[index].dp
                                    startchat(recentchat[index])
                                }}>

                                    <View style={{ marginTop: 18, flexDirection: 'row', width: '90%', alignSelf: 'center', borderRadius: 35, }}>
                                        <View style={{ marginLeft: 12, margin: 7, }}>
                                            {item.dp == null || item.dp == undefined || item.dp == "" ?
                                                <Image style={{ height: 50, width: 50, }} source={require('../../assets/img5.png')}></Image>
                                                :
                                                <Image style={{ height: 60, width: 60, borderRadius: 30 }} src={item.dp}></Image>
                                            }
                                        </View>
                                        <View style={{ flexDirection: 'column', justifyContent: 'center', }}>
                                            <Text style={{ fontSize: 22, fontWeight: '900', marginLeft: 15 }}>{item.firstname} {item.lastname}</Text>
                                            <Text style={{ fontSize: 18, marginLeft: 15, color: '#505050' }}>{item.email}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                :
                                null

                        )

                    }}
                    renderHiddenItem={(item, index) => {
                        return (
                            data != null ?
                                <View style={{ flexDirection: 'row', }}>

                                    <TouchableOpacity
                                        style={[styless.rightAction, { backgroundColor: 'red', }]}
                                        onPress={() => {
                                            // Alert.alert('Delete?', data.name);
                                        }}
                                    >
                                        <Image
                                            source={require('../../assets/tash.png')}
                                            style={{ width: 25, height: 25, tintColor: 'white', }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                :
                                null
                        )
                    }}
                    rightOpenValue={80}
                />

            </View>

            <TouchableOpacity style={{ position: 'absolute', right: 15, bottom: 15 }} onPress={() => {
                getcontacts()
                setModalVisible2(!modalVisible2)
            }}>
                <View style={{ backgroundColor: '#6148B4', width: 60, height: 60, justifyContent: 'center', alignItems: 'center', borderRadius: 35, }}>
                    <Image style={{ height: 30, width: 30, }} source={require('../../assets/newchat.png')}></Image>
                </View>

            </TouchableOpacity>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => {
                    setModalVisible2(!modalVisible2);
                }}>
                <View style={styless.centeredView}>
                    <View style={{ height: 60, width: '90%', flexDirection: 'row', marginLeft: 20, alignItems: 'center', }}>
                        <View style={{ height: 40, width: 50, alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => { setModalVisible2(false) }}>
                                <Image style={{ height: 35, width: 45, }} source={require('../../assets/backbtn.png')}></Image>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ color: 'white', fontWeight: '900', fontSize: 25, marginLeft: 10, }}>
                            Contacts
                        </Text>

                    </View>
                    <View style={styless.modalView}>
                        <TouchableOpacity style={{ alignSelf: 'center', marginTop: 10 }} onPress={() => { setModalVisible2(false) }}>
                            <Image style={{ height: 10, width: 40, }} source={require('../../assets/horizontalbar.png')}></Image>
                        </TouchableOpacity>

                        <View style={{ overflow: 'hidden', height: '90%' }}>
                            <FlatList
                                style={styless.container}
                                data={contacts}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={styless.container}>
                                            <TouchableOpacity onPress={() => {
                                                showname = contacts[index].firstname + " " + contacts[index].lastname
                                                currentuserdp = contacts[index].dp
                                                setModalVisible2(false)
                                                startchat(contacts[index])
                                                // console.log(contacts[index])
                                                // console.log(index)
                                            }}>
                                                <View style={styless.row}>
                                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                                                    <Text>{item.number}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}
                            //  keyExtractor={extractKey}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible1}
                onRequestClose={() => {
                    setModalVisible1(!modalVisible1);
                }}>
                <View style={[styless.centeredView, { marginTop: 10 }]}>
                    <View style={{ height: 60, width: '90%', flexDirection: 'row', marginLeft: 20, alignItems: 'center', marginBottom: 10 }}>
                        <View style={{ height: 40, width: 50, alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => { setModalVisible1(!modalVisible1) }}>
                                <Image style={{ height: 35, width: 45, }} source={require('../../assets/backbtn.png')}></Image>
                            </TouchableOpacity>
                        </View>
                        {
                            currentuserdp == null || currentuserdp == undefined || currentuserdp == ""
                                ?
                                <Image style={{ height: 50, width: 50, borderRadius: 25, }} source={require('../../assets/img1.png')}></Image>
                                :
                                <Image style={{ height: 50, width: 50, borderRadius: 25 }} src={currentuserdp}></Image>
                        }

                        <Text style={{ color: 'white', fontWeight: '900', fontSize: 18, marginLeft: 10, }}>
                            {showname}
                        </Text>
                        <View style={{ height: 40, width: 40, borderColor: 'red', alignItems: 'center', position: 'absolute', right: 10, top: 15 }}>
                            <TouchableOpacity>
                                <Image style={{ height: 30, width: 40, }} source={require('../../assets/phone.png')}>{showimage}</Image>
                            </TouchableOpacity>
                        </View>


                    </View>
                    <View style={styless.modalView}>
                        <TouchableOpacity style={{ alignSelf: 'center', marginTop: 10 }} onPress={() => { setModalVisible1(!modalVisible1) }}>
                            <Image style={{ height: 10, width: 40, }} source={require('../../assets/horizontalbar.png')}></Image>
                        </TouchableOpacity>

                        <View style={{ overflow: 'hidden', height: '90%' }}>
                            <FlatList
                                showsVerticalScrollIndicator={false} style={{ marginTop: 10, }}
                                data={Flatlistdata}
                                ref={flatRef}
                                inverted
                                renderItem={({ item }) => {
                                    return (
                                        comkey != null || comkey != undefined ?
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

                                            chatstarted(comkey)
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
            </Modal>
            {loading ? CustomActivityIndicator() : null}
            <StatusBar style="light" hidden={false} backgroundColor='#6148B4' />
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
        height: '95%',
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


    rightAction: {
        marginVertical: 25,
        width: 50,
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});