import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, useColorScheme } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function TermsAndConditionsScreen() {
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
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>Terms & Conditions</Text>
        </View>

        <ScrollView style={[styles.content, { backgroundColor: isDark ? '#121212' : '#fff' }]} showsVerticalScrollIndicator={false}>
          <Text style={[styles.lastUpdated, { color: isDark ? '#AAAAAA' : '#666' }]}>Effective Date: May 1, 2025</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>1. Acceptance of Terms</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            By accessing or using the Toonify mobile application ("App"), you agree to be bound by these Terms and Conditions ("Terms").
          </Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            If you do not agree to these Terms, please do not use the App.
          </Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>2. Description of Service</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            Toonify allows users to:
          </Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Create an account via Email and Password or authenticate using Google or Apple Sign-In.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Upload images for processing into cartoon-style images using third-party services.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• View both original and generated images within the app.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Purchase credits for additional image generations.</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>3. User Content</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• You are responsible for any images you upload to the App.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• By uploading an image, you grant Toonify a non-exclusive, limited license to process, store, and display the image for your use within the App.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• You retain ownership of the original images you upload and the generated images.</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>4. Acceptable Use</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            You agree not to:
          </Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Upload any content that is unlawful, harmful, defamatory, obscene, or otherwise objectionable.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Attempt to misuse, hack, or disrupt the App's functionality or security.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Infringe upon the intellectual property rights of others.</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>5. Purchases and Credits</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• The App offers the purchase of credit plans through in-app purchases.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Credits allow users to generate additional images.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• All purchases are final and non-refundable, except as required by law or under App Store policies.</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>6. AI-Generated Content Disclaimer</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Toonify utilizes AI models from third-party providers to generate images.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• Generated content may be imperfect, and Toonify makes no guarantees regarding the accuracy, appropriateness, or suitability of the generated images.</Text>
          <Text style={[styles.listItem, { color: isDark ? '#DDDDDD' : '#333' }]}>• You acknowledge that any explicit, inappropriate, or offensive content resulting from uploads or AI generation is unintended, and Toonify disclaims all liability for such content.</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>7. Limitation of Liability</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            To the fullest extent permitted by law, Toonify and its developers are not liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the App.
          </Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>8. Termination</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            We may suspend or terminate your access to the App at our sole discretion if you violate these Terms.
          </Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>9. Changes to Terms</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            We reserve the right to modify these Terms at any time. Updates will be effective immediately upon posting within the App. Your continued use of the App after changes indicates acceptance.
          </Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>10. Governing Law</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            These Terms shall be governed by and construed in accordance with the laws of the United States of America.
          </Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>11. Contact Us</Text>
          <Text style={[styles.paragraph, { color: isDark ? '#DDDDDD' : '#333' }]}>
            If you have any questions about these Terms, please contact us at:
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
