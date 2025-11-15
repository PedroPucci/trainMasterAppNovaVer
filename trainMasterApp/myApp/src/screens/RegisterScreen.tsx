import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles as s } from "./styles";
import { cpf as cpfValidator, email as emailValidator, required } from "../components/utils/validators";
import { maskCPF } from "../components/utils/masks";
import { BASE_URL, fetchComTimeout } from "../components/routes/apiConfig";

type Errors = {
  cpf?: string | null;
  FullName?: string | null;
  email?: string | null;
  password?: string | null;
  confirm?: string | null;
};

export default function RegisterScreen({ navigation }: any) {
  const [cpf, setCpf] = useState("");
  const [FullName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const TOP_SAFE = Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 12 : 24;

  const validateField = (k: keyof Errors): string | null => {
    switch (k) {
      case "cpf":
        return cpfValidator(cpf);
      case "FullName":
        return required(FullName, "Nome completo");
      case "email":
        return emailValidator(email);
      case "password":
        if (!password.trim()) return "Senha é obrigatória";
        if (password.length < 6) return "Mínimo de 6 caracteres";
        return null;
      case "confirm":
        if (!confirm.trim()) return "Confirmação é obrigatória";
        if (confirm !== password) return "As senhas não conferem";
        return null;
      default:
        return null;
    }
  };

  const validateAll = () => {
    const next: Errors = {
      cpf: validateField("cpf"),
      FullName: validateField("FullName"),
      email: validateField("email"),
      password: validateField("password"),
      confirm: validateField("confirm"),
    };
    setErrors(next);
    return Object.values(next).every((e) => !e);
  };

  const onSubmit = async () => {
    if (!validateAll()) {
      Alert.alert("Atenção", "Corrija os campos destacados.");
      return;
    }

    const payload = {
      cpf: cpf.replace(/\D/g, ""),
      FullName: FullName.trim(),
      email: email.trim(),
      password: password,
    };

    try {
      setLoading(true);

      const url = `${BASE_URL}/users/adicionar`;
      const res = await fetchComTimeout(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      let data: any = null;
      try { data = JSON.parse(raw); } catch {}

      if (!res.ok) {
        const msg =
          data?.message ||
          (res.status === 409
            ? "CPF ou e-mail já cadastrados."
            : res.status === 400
            ? "Dados inválidos."
            : raw || `HTTP ${res.status}`);
        Alert.alert("Erro", msg);
        return;
      } else if(!data.success) {
         Alert.alert("Erro", data.message);
         return;
      }

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      navigation.reset({ index: 0, routes: [{ name: "Entrar" }] });
    } catch (e: any) {
      const msg =
        e?.message === "Tempo limite excedido"
          ? "Conexão lenta/instável. Tente novamente."
          : "Não foi possível registrar.";
      Alert.alert("Erro de conexão", msg);
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
        <Text style={s.title}>Criar conta</Text>
        <Text style={s.subtitle}>Digite as informações abaixo:</Text>

        <Image
          source={require("../../assets/images/logo6.png")}
          style={[s.logo]}
          resizeMode="contain"
        />

        <View style={[s.inputWrap, errors.cpf && s.inputError]}>
          <TextInput
            style={s.input}
            value={cpf}
            onChangeText={(t) => setCpf(maskCPF(t))}
            onBlur={() => setErrors((p) => ({ ...p, cpf: validateField("cpf") }))}
            placeholder="Digite o CPF"
            placeholderTextColor="#9AA6AC"
            keyboardType="numeric"
            returnKeyType="next"
          />
        </View>
        {errors.cpf ? <Text style={s.errorText}>{errors.cpf}</Text> : null}

        <View style={[s.inputWrap, errors.FullName && s.inputError]}>
          <TextInput
            style={s.input}
            value={FullName}
            onChangeText={setName}
            onBlur={() => setErrors((p) => ({ ...p, name: validateField("FullName") }))}
            placeholder="Digite o nome completo"
            placeholderTextColor="#9AA6AC"
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>
        {errors.FullName ? <Text style={s.errorText}>{errors.FullName}</Text> : null}

        <View style={[s.inputWrap, errors.email && s.inputError]}>
          <TextInput
            style={s.input}
            value={email}
            onChangeText={setEmail}
            onBlur={() => setErrors((p) => ({ ...p, email: validateField("email") }))}
            placeholder="Digite o e-mail"
            placeholderTextColor="#9AA6AC"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />
        </View>
        {errors.email ? <Text style={s.errorText}>{errors.email}</Text> : null}

        <View style={[s.inputWrap, errors.password && s.inputError]}>
          <TextInput
            style={s.input}
            value={password}
            onChangeText={setPassword}
            onBlur={() => setErrors((p) => ({ ...p, password: validateField("password") }))}
            placeholder="Digite a senha"
            placeholderTextColor="#9AA6AC"
            secureTextEntry={!showPwd}
            autoCapitalize="none"
            returnKeyType="next"
          />
          <TouchableOpacity style={s.eye} onPress={() => setShowPwd((v) => !v)}>
            <Feather name={showPwd ? "eye-off" : "eye"} size={18} color="#6D7A80" />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={s.errorText}>{errors.password}</Text> : null}

        <View style={[s.inputWrap, errors.confirm && s.inputError]}>
          <TextInput
            style={s.input}
            value={confirm}
            onChangeText={setConfirm}
            onBlur={() => setErrors((p) => ({ ...p, confirm: validateField("confirm") }))}
            placeholder="Confirme a senha"
            placeholderTextColor="#9AA6AC"
            secureTextEntry={!showConfirm}
            autoCapitalize="none"
            returnKeyType="send"
            onSubmitEditing={onSubmit}
          />
          <TouchableOpacity style={s.eye} onPress={() => setShowConfirm((v) => !v)}>
            <Feather name={showConfirm ? "eye-off" : "eye"} size={18} color="#6D7A80" />
          </TouchableOpacity>
        </View>
        {errors.confirm ? <Text style={s.errorText}>{errors.confirm}</Text> : null}

        <TouchableOpacity
          style={[s.btnPrimary, loading && { opacity: 0.7 }]}
          activeOpacity={0.9}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Registrar</Text>}
        </TouchableOpacity>

        <Text style={s.registerText}>
          <Text style={s.registerLink} onPress={() => navigation?.navigate?.("Entrar")}>
            {" "}Realizar Login
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}