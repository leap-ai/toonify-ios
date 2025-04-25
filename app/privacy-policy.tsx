import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, useColorScheme } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PrivacyPolicyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
        <View style={[styles.header, { backgroundColor: isDark ? '#1A1A1A' : '#fff', borderBottomColor: isDark ? '#333' : '#eee' }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>Privacy Policy</Text>
        </View>

        <ScrollView style={[styles.content, { backgroundColor: isDark ? '#121212' : '#fff' }]} showsVerticalScrollIndicator={false}>
          <Text style={[styles.lastUpdated, { color: isDark ? '#AAAAAA' : '#666' }]}>Last Updated: March 15, 2024</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>1. Introduction</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            Welcome to Toonify. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our app and tell you about your privacy rights and how the law protects you.
          </Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>2. Information We Collect</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            We collect and process the following information about you:
          </Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Personal identification information (name, email address)</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Images you upload for processing</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Usage data (how you use our app)</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Device information (device type, operating system)</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>3. How We Use Your Information</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            We use the information we collect to:
          </Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Provide and maintain our service</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Process your image requests</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Manage your account</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Improve our app and services</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Communicate with you about updates and changes</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>4. Data Security</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>5. Your Rights</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            You have the right to:
          </Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Access your personal data</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Request correction of your personal data</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Request deletion of your personal data</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Object to processing of your personal data</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Request transfer of your personal data</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>6. Contact Us</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>support@toonify.com</Text>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: isDark ? '#AAAAAA' : '#666' }]}>© 2024 Toonify. All rights reserved.</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
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
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
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
  },
});