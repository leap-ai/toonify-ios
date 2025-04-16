import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import Purchases, { PurchasesPackage } from 'react-native-purchases';

// Dummy packages data
const DUMMY_PACKAGES = [
  {
    identifier: 'credits_10',
    product: {
      title: '10 Credits',
      priceString: '$0.99',
    }
  },
  {
    identifier: 'credits_50',
    product: {
      title: '50 Credits',
      priceString: '$3.99',
    }
  },
  {
    identifier: 'credits_100',
    product: {
      title: '100 Credits',
      priceString: '$7.99',
    }
  }
];

export default function CreditsScreen() {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [credits, setCredits] = useState(10); // Dummy initial credits

  useEffect(() => {
    initializePurchases();
  }, []);

  const initializePurchases = async () => {
    try {
      // In production, this would be configured with your RevenueCat API key
      setPackages(DUMMY_PACKAGES as unknown as PurchasesPackage[]);
    } catch (error) {
      console.error('Error initializing purchases:', error);
    }
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    try {
      // In production, this would make an actual purchase through RevenueCat
      // and send the transaction data to your backend
      Alert.alert(
        'Purchase Simulation',
        'In production, this would process a real purchase through RevenueCat.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to simulate purchase. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.creditsCard}>
        <Text style={styles.creditsTitle}>Your Credits</Text>
        <Text style={styles.creditsCount}>{credits}</Text>
      </View>

      <Text style={styles.sectionTitle}>Buy Credits</Text>
      {packages.map((pkg) => (
        <TouchableOpacity
          key={pkg.identifier}
          style={styles.packageButton}
          onPress={() => handlePurchase(pkg)}>
          <Text style={styles.packageTitle}>{pkg.product.title}</Text>
          <Text style={styles.packagePrice}>{pkg.product.priceString}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.privacyButton}
        onPress={() => {/* Navigate to privacy policy */}}>
        <Text style={styles.privacyButtonText}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  creditsCard: {
    backgroundColor: '#0066cc',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  creditsTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  creditsCount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  packageButton: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  packagePrice: {
    fontSize: 16,
    color: '#0066cc',
    fontWeight: '600',
  },
  privacyButton: {
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
  },
  privacyButtonText: {
    color: '#666',
    fontSize: 16,
  },
});