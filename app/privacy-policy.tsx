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
          <Text style={[styles.lastUpdated, { color: isDark ? '#AAAAAA' : '#666' }]}>Last Updated: April 28, 2025</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>1. Introduction</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
          Welcome to Toonify ("we," "our," or "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use the Toonify mobile application ("App"). By using the App, you agree to the practices described in this Privacy Policy.
          </Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>2. Information We Collect</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            We collect and process the following information about you:
          </Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Personal information: Email address, password (hashed and securely stored), and authentication tokens (for Google and Apple sign-in).</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Profile Information: Profile picture (if uploaded by the user).</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Uploaded Images: Images you upload for processing.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Generated Images: AI</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Payment Information: We use third-party services to process payments. We do not directly store your financial information.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Device and Usage Data: We may collect device identifiers, operating system information, and usage statistics for analytics and improving the service.</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>3. How We Use Your Information</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            We use the information we collect to:
          </Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Authenticate your account.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Process your uploaded images through our third-party service providers.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Display your original and generated images within the app.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Provide and manage purchases of credit plans.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Improve, maintain, and secure our services.</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>4. Third-Party Services</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            We utilize third-party providers for:
          </Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Image Processing: Images uploaded are processed using Fal.ai's services. Uploaded images may be subject to Fal.ai's policies.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Authentication Services: Google Sign-In and Sign In with Apple for user authentication.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Payment Processing: Purchases are managed through Apple In-App Purchase services and secure payment providers.</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            We are not responsible for the privacy practices of these third parties.
          </Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>5. Data Storage and Security</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Uploaded and generated images are stored securely on third-party servers (Fal.ai).</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Personal data (e.g., email address) is securely stored using industry-standard encryption.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• We take reasonable measures to protect your information from unauthorized access, use, or disclosure.</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>6. Children's Privacy</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            The App is intended for users aged 13 and above. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us.
          </Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>7. Your Rights</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            You have the right to:
          </Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Access your personal data</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Request correction of your personal data</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Request deletion of your personal data</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Object to processing of your personal data</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Request transfer of your personal data</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>8. Changes to this Privacy Policy</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            We reserve the right to update this Privacy Policy from time to time. Changes will be effective immediately upon posting. Continued use of the App indicates acceptance of the updated policy.
          </Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>9. Contact Us</Text>
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
    marginTop: 2,
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