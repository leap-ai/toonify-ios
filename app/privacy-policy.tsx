import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Privacy Policy</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.lastUpdated}>Last Updated: March 15, 2024</Text>

          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to Toonify. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our app and tell you about your privacy rights and how the law protects you.
          </Text>

          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect and process the following information about you:
          </Text>
          <Text style={styles.listItem}>• Personal identification information (name, email address)</Text>
          <Text style={styles.listItem}>• Images you upload for processing</Text>
          <Text style={styles.listItem}>• Usage data (how you use our app)</Text>
          <Text style={styles.listItem}>• Device information (device type, operating system)</Text>

          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect to:
          </Text>
          <Text style={styles.listItem}>• Provide and maintain our service</Text>
          <Text style={styles.listItem}>• Process your image requests</Text>
          <Text style={styles.listItem}>• Manage your account</Text>
          <Text style={styles.listItem}>• Improve our app and services</Text>
          <Text style={styles.listItem}>• Communicate with you about updates and changes</Text>

          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </Text>

          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:
          </Text>
          <Text style={styles.listItem}>• Access your personal data</Text>
          <Text style={styles.listItem}>• Request correction of your personal data</Text>
          <Text style={styles.listItem}>• Request deletion of your personal data</Text>
          <Text style={styles.listItem}>• Object to processing of your personal data</Text>
          <Text style={styles.listItem}>• Request transfer of your personal data</Text>

          <Text style={styles.sectionTitle}>6. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>support@toonify.com</Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2024 Toonify. All rights reserved.</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginLeft: 16,
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 8,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});