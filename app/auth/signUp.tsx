import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { z } from 'zod';
import Container from '@/components/Container';
import { API_BASE_URL } from '@/config';
import PigmentoLogo from "@/assets/svg/logo-pigmento.svg";

const signUpSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters long' })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface ApiResponse {
  message?: string;
}

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: SignUpFormData): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData: ApiResponse = await response.json();
        Alert.alert('Error', errorData.message || 'Something went wrong');
        return;
      }

      Alert.alert('Success', 'Account created successfully');
      router.push('/auth/signIn');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    }
  };

  return (
    <Container>
      <PigmentoLogo style={styles.logo} width={40} height={40} />
      <Text style={styles.title}>Sign Up to see photos and score from your friends</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="johndoe@gmail.com"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize='none'
            />
          </View>
        )}
      />
      {errors.email && <Text style={styles.errorText}>{String(errors.email.message)}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="eadZkfs@*"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          </View>
        )}
      />
      {errors.password && <Text style={styles.errorText}>{String(errors.password.message)}</Text>}

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="eadZkfs@*"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          </View>
        )}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{String(errors.confirmPassword.message)}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/auth/signIn')}>
        <Text style={styles.signUpText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  logo:{
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginVertical: 10,
    padding: 15,
    width: '80%'
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'left',
    width: '80%'
  },
  input: {
    borderColor: '#ccc',
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    borderWidth: 1,
    padding: 10
  },
  inputContainer: {
    marginVertical: 10,
    width: '80%'
  },
  label: {
    color: '#333',
    fontSize: 16,
    marginBottom: 5
  },
  signUpText: {
    color: '#888888',
    marginTop: 20,
    textDecorationLine: 'underline'
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    width: '70%',
    textAlign: 'center',
  }
});