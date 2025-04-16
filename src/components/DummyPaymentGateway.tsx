import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { config } from '../config';

interface DummyPaymentGatewayProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

const DummyPaymentGateway: React.FC<DummyPaymentGatewayProps> = ({
  amount,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a dummy payment ID
      const paymentId = `dummy_payment_${Date.now()}`;
      
      // Send payment data to backend
      const response = await fetch(`${config.api.url}/credits/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          paymentId,
          paymentMethod: 'dummy',
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      onSuccess(paymentId);
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dummy Payment Gateway</Text>
      <Text style={styles.amount}>Amount: ${amount}</Text>
      
      <View style={styles.cardDetails}>
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          value="4242 4242 4242 4242"
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Expiry Date"
          value="12/25"
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          value="123"
          editable={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.payButton]}
          onPress={handlePayment}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : 'Pay Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  amount: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  cardDetails: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
  },
  payButton: {
    backgroundColor: '#34c759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DummyPaymentGateway; 