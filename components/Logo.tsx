import { Image, StyleSheet, View } from "react-native";

export default function Logo({ size = 64 }: { size?: number }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/logo.png")}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
  },
});
