import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      
      <Text style={styles.section}>1. Information We Collect</Text>
      <Text style={styles.content}>
        We collect and process the following information when you use our app:
        {'\n'}- Images you upload for cartoonification
        {'\n'}- User account information (email)
        {'\n'}- Purchase history and credit balance
        {'\n'}- Generation history
      </Text>

      <Text style={styles.section}>2. How We Use Your Information</Text>
      <Text style={styles.content}>
        Your information is used to:
        {'\n'}- Process and store your cartoon image generations
        {'\n'}- Maintain your credit balance
        {'\n'}- Improve our services
        {'\n'}- Provide customer support
      </Text>

      <Text style={styles.section}>3. Image Processing</Text>
      <Text style={styles.content}>
        When you upload an image:
        {'\n'}- It is processed by our AI service to create a cartoon version
        {'\n'}- Both original and cartoonified images are stored securely
        {'\n'}- Images are associated with your account for history purposes
        {'\n'}- We do not use your images for any other purpose
      </Text>

      <Text style={styles.section}>4. Data Storage</Text>
      <Text style={styles.content}>
        - All data is stored securely using encryption
        {'\n'}- Images are stored in secure cloud storage
        {'\n'}- User data is protected by industry-standard security measures
      </Text>

      <Text style={styles.section}>5. Content Guidelines</Text>
      <Text style={styles.content}>
        We prohibit the upload and processing of:
        {'\n'}- Explicit or adult content
        {'\n'}- Violent or graphic imagery
        {'\n'}- Copyrighted material without permission
        {'\n'}- Any illegal content
      </Text>

      <Text style={styles.section}>6. Data Deletion</Text>
      <Text style={styles.content}>
        You can request deletion of your:
        {'\n'}- Account information
        {'\n'}- Generated images
        {'\n'}- Usage history
        Contact our support team to initiate this process.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});