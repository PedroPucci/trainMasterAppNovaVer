import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
  Image, ScrollView, StatusBar, Pressable 
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { routes } from "../components/routes/routes";
import { styles as s } from "./styles";
import { required, email as emailValidator } from "../components/utils/validators";
import * as Clipboard from "expo-clipboard";
import { BASE_URL, fetchComTimeout } from "../components/routes/apiConfig";

export default function RecoverPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});
  const TOP_SAFE = Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 12 : 24;

  const validateEmailField = (): string | null => {
    const e = required(email.trim(), "E-mail") ?? emailValidator(email.trim());
    setErrors((p) => ({ ...p, email: e }));
    return e;
  };

  const copyPassword = async () => {
    if (!password) return;
    try {
      await Clipboard.setStringAsync(password);
      Alert.alert("Copiado", "Senha copiada para a área de transferência.");
    } catch {
      Alert.alert("Erro", "Não foi possível copiar a senha.");
    }
  };

  const validateForm = () => {
    const e1 = validateEmailField();
    return !e1;
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Atenção", "Corrija os campos destacados.");
      return;
    }
    try {
      setLoading(true);
      await routes.auth.forgotPassword({ email: email.trim(), newPassword: password });
      navigation?.goBack?.();
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Não foi possível redefinir a senha.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };
  const handleRecuperar = async () => {
  if (!email.trim()) {
    Alert.alert("Erro", "Informe o email.");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    Alert.alert("Erro", "Informe um email válido.");
    return;
  }

  setLoading(true);
  try {
    const url = `${BASE_URL}/auth/reset-password`;
    const res = await fetchComTimeout(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });

    const raw = await res.text();
    let data: any = null;
    try { data = JSON.parse(raw); } catch {}

    if (!res.ok) {
      const msg = data?.message || raw || `HTTP ${res.status}`;
      Alert.alert("Erro", msg);
      return;
    }

    const nova = data?.message;
    if (typeof nova === "string" && nova.length > 0) {
      setPassword(nova);  
      setEmail("");
      Alert.alert("Sucesso", "Verifique a nova senha na tela.");
    } else {
      Alert.alert("Aviso", "Resposta inesperada do servidor.");
    }
  } catch (err: unknown) {
    let message = "Entre em contato com o suporte para verificar o problema.";
    if (err instanceof TypeError && err.message === "Network request failed") {
      message = "Falha de rede: confira o IP/porta e use HTTP.";
    } else if (err instanceof Error) {
      const isTimeout =
        err.message === "Tempo limite excedido" ||
        err.name === "AbortError" ||
        (err as any).code === "TIMEOUT";
      message = isTimeout
        ? "A conexão está lenta ou instável. Por favor, tente novamente em instantes."
        : (err.message || message);
    }
    Alert.alert("Erro de conexão", message);
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

      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Recupere sua senha</Text>
        <Text style={s.subtitle}>Digite a informação abaixo:</Text>

        <Image source={require("../../assets/images/logo6.png")} style={s.logo} resizeMode="contain" />

        <View style={[s.inputWrap, errors.email && s.inputError]}>
          <TextInput
            style={s.input}
            value={email}
            onChangeText={setEmail}
            onBlur={validateEmailField}
            placeholder="Digite o email"
            placeholderTextColor="#9AA6AC"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />
        </View>
        {errors.email ? <Text style={s.errorText}>{errors.email}</Text> : null}

        <Text style={s.helper}>Verifique sua nova senha abaixo:</Text>

        <Pressable
          style={[s.inputWrapDark]}
          onLongPress={copyPassword}
          delayLongPress={250}
        >
          <TextInput
            style={s.inputDark}
            value={password}
            onChangeText={setPassword}
            placeholder="Sua nova senha gerada"
            placeholderTextColor="#DCE0E2"
            editable={false}                 
            caretHidden                       
            selectTextOnFocus={false}
            contextMenuHidden                 
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[s.copy, { opacity: password ? 1 : 0.35 }]}
            onPress={copyPassword}
            onLongPress={copyPassword}
            disabled={!password}
            accessibilityLabel="Copiar senha"
          >
            <Feather name="copy" size={18} color="#fff" />
          </TouchableOpacity>
        </Pressable>

        <TouchableOpacity
          style={[s.btnPrimary, loading && { opacity: 0.7 }]}
          activeOpacity={0.9}
          onPress={handleRecuperar}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Gerar nova senha</Text>}
        </TouchableOpacity>

        <Text style={s.registerText}>
          Ainda não tem conta?
          <Text style={s.registerLink} onPress={() => navigation?.navigate?.("Register")}> Registrar</Text>
        </Text>
        <Text style={s.registerText}>
          <Text style={s.registerLink} onPress={() => navigation?.navigate?.("Entrar")}> Login</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}