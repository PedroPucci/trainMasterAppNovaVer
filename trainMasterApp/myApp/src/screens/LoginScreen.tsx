import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles as s } from "./styles";
import { maskCPF } from "../components/utils/masks";
import { required, cpf as cpfValidator } from "../components/utils/validators";
import * as Clipboard from "expo-clipboard";
import { CommonActions } from "@react-navigation/native";
import { BASE_URL, fetchComTimeout } from "../components/routes/apiConfig";
import { authService } from "../services/auth/auth.service";

export default function LoginScreen({ navigation }: any) {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const copyPassword = async () => {
    if (!password) return;
    try {
      await Clipboard.setStringAsync(password);
    } catch {
      Alert.alert("Erro", "Não foi possível copiar a senha.");
    }
  };

  const [errors, setErrors] = useState<{
    cpf?: string | null;
    password?: string | null;
  }>({});

  const TOP_SAFE =
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 12 : 24;

  const validateCpfField = (): string | null => {
    const err = required(cpf, "CPF") ?? cpfValidator(cpf);
    setErrors((p) => ({ ...p, cpf: err }));
    return err;
  };

  const validatePasswordField = (): string | null => {
    const err = password.trim() ? null : "Senha é obrigatória";
    setErrors((p) => ({ ...p, password: err }));
    return err;
  };

  const validateForm = () => {
    const e1 = validateCpfField();
    const e2 = validatePasswordField();
    return !e1 && !e2;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      cpf: cpf.replace(/\D/g, ""),
      password: password,
    };

    try {
      setLoading(true);
      const res = await authService.login(payload)
      Alert.alert("Sucesso", "Acesso autorizado!");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "App", 
              params: {
                screen: "HomeTabs", 
                params: { screen: "Inicio" }, 
              },
            },
          ],
        })
      );
    } catch (error) {
      console.log("Erro Login")
      Alert.alert("Erro", "Falha ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[s.container, { paddingTop: TOP_SAFE }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={s.bubbleLg} />
      <View style={s.bubbleSm} />

      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={s.title}>Seja bem-vindo!</Text>
        <Text style={s.subtitle}>
          Digite suas credenciais para{"\n"}acessar sua conta:
        </Text>

        <Image
          source={require("../../assets/images/logo6.png")}
          style={s.logo}
          resizeMode="contain"
        />

        <View style={s.inputWrap}>
          <TextInput
            style={s.input}
            value={cpf}
            onChangeText={(t) => setCpf(maskCPF(t))}
            onBlur={validateCpfField}
            placeholder="CPF"
            placeholderTextColor="#9AA6AC"
            keyboardType="numeric"
            returnKeyType="next"
            autoCapitalize="none"
            maxLength={14}
          />
        </View>
        {errors.cpf ? (
          <Text
            style={{
              color: "#E63946",
              fontSize: 12,
              fontWeight: "600",
              marginTop: 6,
            }}
          >
            {errors.cpf}
          </Text>
        ) : null}

        <View style={s.inputWrap}>
          <TextInput
            style={s.input}
            value={password}
            onChangeText={setPassword}
            onBlur={validatePasswordField}
            placeholder="Senha"
            placeholderTextColor="#9AA6AC"
            secureTextEntry={!showPwd}
            returnKeyType="send"
            onSubmitEditing={onSubmit}
            autoCapitalize="none"
          />
          <TouchableOpacity style={s.eye} onPress={() => setShowPwd((v) => !v)}>
            <Feather
              name={showPwd ? "eye-off" : "eye"}
              size={18}
              color="#6D7A80"
            />
          </TouchableOpacity>
        </View>
        {errors.password ? (
          <Text
            style={{
              color: "#E63946",
              fontSize: 12,
              fontWeight: "600",
              marginTop: 6,
            }}
          >
            {errors.password}
          </Text>
        ) : null}

        <TouchableOpacity onPress={() => navigation?.navigate?.("Recover")}>
          <Text style={s.forgotText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.btnPrimary, loading && { opacity: 0.7 }]}
          activeOpacity={0.9}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.btnText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <Text style={s.registerText}>
          Ainda não tem conta?
          <Text
            style={s.registerLink}
            onPress={() => navigation?.navigate?.("Register")}
          >
            {" "}
            Registrar
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
