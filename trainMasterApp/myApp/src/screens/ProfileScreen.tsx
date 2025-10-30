import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import AppHeader from "../components/header/AppHeader";
import { styles as s } from "./styles";
import { required, email, cpf, birthDateBR, oneOf } from "../components/utils/validators";
import { maskDateBR, maskCPF } from "../components/utils/masks";
import { BASE_URL, fetchComTimeout } from "../components/routes/apiConfig";
import { useAppTheme } from "../components/theme/ThemeProvider";
import { authService } from "../services/auth/auth.service";

const ESTADOS_CIVIS = ["Solteiro", "Casado", "Divorciado", "Viúvo", "União estável"];
const GENEROS = ["Feminino", "Masculino", "Outro", "Prefiro não dizer"];

type Form = {
  name: string;
  email: string;
  birth: string;
  doc: string;
  maritalStatus: string;
  gender: string;
};
type Errors = Partial<Record<keyof Form, string | null>>;

type CenteredPickerProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
  error?: string | null;
};

function CenteredPicker({ value, onChange, placeholder, options, error }: CenteredPickerProps) {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#000000";
  const hardMuted = isDark ? "#A3A3A3" : "#666666";
  const hardBorder = isDark ? "#222222" : "#E5E5E5";

  return (
    <View
      style={[
        s.inputWrap,
        s.pickerWrapper,
        {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: hardBorder,
          shadowOpacity: 0,
          elevation: 0,
        },
        error && s.inputErrorWrap,
      ]}
    >
      <Text style={[s.pickerValueText, { color: value ? hardText : hardMuted }]} numberOfLines={1}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={18} color={hardMuted} style={s.pickerChevron} />
      <Picker
        selectedValue={value}
        onValueChange={(val) => onChange(val as string)}
        style={s.pickerOverlay}
        dropdownIconColor="transparent"
      >
        <Picker.Item label={placeholder} value="" color={hardMuted} />
        {options.map((opt) => (
          <Picker.Item key={opt} label={opt} value={opt} />
        ))}
      </Picker>
    </View>
  );
}

function formatDateBRFromISO(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
function genderApiToUi(v: number | string | undefined): string {
  if (v === undefined || v === null) return "";
  if (typeof v === "number") return GENEROS[v] ?? "";
  const map: Record<string, string> = {
    Feminino: "Feminino",
    Masculino: "Masculino",
    Outro: "Outro",
    PrefiroNaoDizer: "Prefiro não dizer",
    "Prefiro_não_dizer": "Prefiro não dizer",
    "Prefiro não dizer": "Prefiro não dizer",
  };
  return map[v] ?? v;
}
function maritalApiToUi(v: number | string | undefined): string {
  if (v === undefined || v === null) return "";
  if (typeof v === "number") return ESTADOS_CIVIS[v] ?? "";
  const map: Record<string, string> = {
    Solteiro: "Solteiro",
    Casado: "Casado",
    Divorciado: "Divorciado",
    Viúvo: "Viúvo",
    Viuvo: "Viúvo",
    UniaoEstavel: "União estável",
    "União_estável": "União estável",
    "União estável": "União estável",
  };
  return map[v] ?? v;
}
function uiGenderToApi(label: string): number | null {
  const idx = GENEROS.indexOf(label);
  return idx >= 0 ? idx : null;
}
function uiMaritalToApi(label: string): number | null {
  const idx = ESTADOS_CIVIS.indexOf(label);
  return idx >= 0 ? idx : null;
}
function dateBRtoISO(dateBR: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateBR);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}T00:00:00`;
}

export default function ProfileScreen() {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#000000";
  const hardMuted = isDark ? "#A3A3A3" : "#666666";
  const hardBorder = isDark ? "#222222" : "#E5E5E5";
  const primary = theme.colors.primary;

  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    birth: "",
    doc: "",
    maritalStatus: "",
    gender: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const USER_ID = authService.getUserId();

  const update = (k: keyof Form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validateField = (k: keyof Form): string | null => {
    switch (k) {
      case "name":
        return required(form.name, "Nome");
      case "email":
        return email(form.email);
      case "birth":
        return birthDateBR(form.birth);
      case "doc":
        return cpf(form.doc);
      case "maritalStatus":
        return oneOf(ESTADOS_CIVIS, "Estado civil")(form.maritalStatus);
      case "gender":
        return oneOf(GENEROS, "Gênero")(form.gender);
      default:
        return null;
    }
  };

  const validateForSave = (): boolean => {
    const next: Errors = {};
    next.doc = validateField("doc");
    next.email = validateField("email");
    next.gender = validateField("gender");
    setErrors((prev) => ({ ...prev, ...next }));
    return !next.doc && !next.email && !next.gender;
  };

  const loadUser = async () => {
    setLoading(true);
    try {
      const url = `${BASE_URL}/profile/${USER_ID}`;
      const res = await fetchComTimeout(url, { method: "GET" });
      const raw = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(raw);
      } catch {}
      if (!res.ok) {
        Alert.alert("Erro", data?.message || raw || `HTTP ${res.status}`);
        return;
      }
      const u = data?.data ?? data;
      setForm((f) => ({
        name: u?.fullName ?? u?.FullName ?? f.name,
        email: u?.email ?? u?.Email ?? f.email,
        birth: u?.dateOfBirth ? formatDateBRFromISO(u.dateOfBirth) : f.birth,
        doc: u?.cpf || u?.Cpf ? maskCPF(u.cpf ?? u.Cpf) : f.doc,
        maritalStatus: u?.marital ?? u?.Marital ? maritalApiToUi(u.marital ?? u.Marital) : f.maritalStatus,
        gender: u?.gender ?? u?.Gender ? genderApiToUi(u.gender ?? u.Gender) : f.gender,
      }));
    } catch (e: any) {
      const msg =
        e?.message === "Tempo limite excedido"
          ? "Conexão lenta/instável. Tente novamente."
          : "Não foi possível carregar o perfil.";
      Alert.alert("Erro de conexão", msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const onSubmit = async () => {
    if (!validateForSave()) {
      Alert.alert("Atenção", "Informe um CPF, e-mail e gênero válidos.");
      return;
    }
    const gVal = uiGenderToApi(form.gender);
    const mVal = uiMaritalToApi(form.maritalStatus);
    if (gVal === null) {
      Alert.alert("Erro", "Selecione o gênero.");
      return;
    }
    const payload = {
      UserId: USER_ID,
      FullName: form.name.trim() || null,
      Email: form.email.trim(),
      Cpf: form.doc.replace(/\D/g, ""),
      DateOfBirth: dateBRtoISO(form.birth),
      Gender: gVal,
      Marital: mVal,
    };

    setSaving(true);
    try {
      const url = `${BASE_URL}/profile/Update/${USER_ID}`;
      const res = await fetchComTimeout(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const raw = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(raw);
      } catch {}
      if (!res.ok) {
        const msg = data?.message || raw || `HTTP ${res.status}`;
        Alert.alert("Erro", msg);
        setSaving(false);
        return;
      }
      await loadUser();
      Alert.alert("Sucesso", "Informações atualizadas com sucesso!");
    } catch (e: any) {
      const msg =
        e?.message === "Tempo limite excedido"
          ? "Conexão lenta/instável. Tente novamente."
          : "Não foi possível salvar as informações.";
      Alert.alert("Erro de conexão", msg);
    } finally {
      setSaving(false);
    }
  };
  const wrapOverride = {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: hardBorder,
    shadowOpacity: 0,
    elevation: 0,
  } as const;

  const inputOverride = {
    backgroundColor: "transparent",
    color: hardText,
    borderColor: hardBorder,
    borderWidth: 0,
  } as const;

  return (
    <View style={[s.container, { backgroundColor: hardBg }]}>
      <AppHeader userName={form.name || "Usuário"} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
          <Text style={[s.sectionTitle, { color: hardText }]}>Perfil</Text>

          {loading ? (
            <View style={{ paddingVertical: 24 }}>
              <ActivityIndicator color={primary} />
            </View>
          ) : null}

          <View style={[s.inputWrap, wrapOverride, errors.name && s.inputErrorWrap]}>
            <TextInput
              style={[s.input, inputOverride]}
              value={form.name}
              onChangeText={update("name")}
              onBlur={() => setErrors((p) => ({ ...p, name: validateField("name") }))}
              placeholder="Nome completo"
              placeholderTextColor={hardMuted}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>
          {errors.name ? <Text style={[s.errorText, { color: "#EF4444" }]}>{errors.name}</Text> : null}

          <View style={[s.inputWrap, wrapOverride, errors.email && s.inputErrorWrap]}>
            <TextInput
              style={[s.input, inputOverride]}
              value={form.email}
              onChangeText={update("email")}
              onBlur={() => setErrors((p) => ({ ...p, email: validateField("email") }))}
              placeholder="E-mail"
              placeholderTextColor={hardMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>
          {errors.email ? <Text style={[s.errorText, { color: "#EF4444" }]}>{errors.email}</Text> : null}

          <View style={[s.inputWrap, wrapOverride, errors.birth && s.inputErrorWrap]}>
            <TextInput
              style={[s.input, inputOverride]}
              value={form.birth}
              onChangeText={(t) => setForm((f) => ({ ...f, birth: maskDateBR(t) }))}
              onBlur={() => setErrors((p) => ({ ...p, birth: validateField("birth") }))}
              placeholder="Data de nascimento (dd/mm/aaaa)"
              placeholderTextColor={hardMuted}
              keyboardType="numeric"
              returnKeyType="next"
            />
          </View>
          {errors.birth ? <Text style={[s.errorText, { color: "#EF4444" }]}>{errors.birth}</Text> : null}

          <View style={[s.inputWrap, wrapOverride, errors.doc && s.inputErrorWrap]}>
            <TextInput
              style={[s.input, inputOverride]}
              value={form.doc}
              onChangeText={(t) => setForm((f) => ({ ...f, doc: maskCPF(t) }))}
              onBlur={() => setErrors((p) => ({ ...p, doc: validateField("doc") }))}
              placeholder="CPF"
              placeholderTextColor={hardMuted}
              keyboardType="number-pad"
              returnKeyType="next"
            />
          </View>
          {errors.doc ? <Text style={[s.errorText, { color: "#EF4444" }]}>{errors.doc}</Text> : null}
          <View style={[s.shadowWrap, isDark && { shadowOpacity: 0, elevation: 0 }]}>
            <CenteredPicker
              value={form.maritalStatus}
              onChange={(v) => {
                update("maritalStatus")(v);
                setErrors((p) => ({ ...p, maritalStatus: validateField("maritalStatus") }));
              }}
              placeholder="Selecione o estado civil"
              options={ESTADOS_CIVIS}
              error={errors.maritalStatus}
            />
          </View>

          <View style={[s.shadowWrap, isDark && { shadowOpacity: 0, elevation: 0 }]}>
            <CenteredPicker
              value={form.gender}
              onChange={(v) => {
                update("gender")(v);
                setErrors((p) => ({ ...p, gender: validateField("gender") }));
              }}
              placeholder="Selecione o gênero"
              options={GENEROS}
              error={errors.gender}
            />
          </View>

          <TouchableOpacity
            style={[s.btnPrimary, (loading || saving) && { opacity: 0.7 }]}
            onPress={onSubmit}
            activeOpacity={0.9}
            disabled={loading || saving}
          >
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={s.btnPrimaryText}>Atualizar</Text>}
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}