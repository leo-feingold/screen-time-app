import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useUser } from "../../context/UserContext";
import { useState } from "react";
import * as FileSystem from "expo-file-system";
import * as mime from "mime";
import uuid from "react-native-uuid";
import { supabase } from "../../lib/supabase";

export default function PersonalAccountScreen() {
  const { username, profilePicUri, setProfilePicUri } = useUser();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleCreatePost = async () => {
    // Ask for permission first
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access photos is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImageUri(pickerResult.assets[0].uri);
      console.log("Image selected:", pickerResult.assets[0].uri);
    }
  };

  const handleProfilePicSelect = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access photos is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // cropped square might be good for profile
      aspect: [1, 1], // ensures square crop
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const uri = pickerResult.assets[0].uri;
      const fileExt = uri.split(".").pop();
      const fileName = `${uuid.v4()}.${fileExt}`;

      console.log("Here:");
      console.log(fileExt, fileName);

      const file = {
        uri,
        name: fileName,
        type: `image/${fileExt}`,
      };

      const response = await fetch(uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(fileName, blob, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        return;
      }

      const publicUrl = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(fileName).data.publicUrl;

      // Update user row
      await supabase
        .from("users")
        .update({ profile_picture_url: publicUrl })
        .eq("username", username);

      setProfilePicUri(publicUrl); // this updates what is shown in the UI
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{username ? `@${username}` : "User"}</Text>

      <TouchableOpacity onPress={handleProfilePicSelect}>
        {profilePicUri ? (
          <Image source={{ uri: profilePicUri }} style={styles.profilePic} />
        ) : (
          <View style={styles.profilePicPlaceholder}>
            <Text style={styles.plusIcon}>+</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <Button title="Share Screen Time Report" onPress={handleCreatePost} />

        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 400, marginTop: 20 }}
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  username: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginTop: 40,
    marginLeft: 20,
  },

  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#ccc",
    marginTop: 10,
    marginLeft: 20,
  },

  profilePicPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
    marginLeft: 20,
  },

  plusIcon: {
    fontSize: 24,
    color: "#888",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  button: {
    width: "60%",
    marginTop: 12,
  },
});
