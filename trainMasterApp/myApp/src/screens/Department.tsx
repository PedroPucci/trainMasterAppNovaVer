import * as React from "react";
import { View, Text, ScrollView } from "react-native";
import AppHeader from "../components/header/AppHeader";
import { useAppTheme } from "../components/theme/ThemeProvider";
import { styles as s } from "./styles";
import { Alert, ActivityIndicator } from "react-native";

import { DepartamentService } from "../services/departament/departament.service";
import { DepartmentProps } from "../services";

export default function DepartmentScreen() {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#000000";
  const hardMuted = isDark ? "#A3A3A3" : "#666666";
  const hardBorder = isDark ? "#222222" : "#E5E5E5";

  const [departmentInfo, setDepartmentInfo] = React.useState<DepartmentProps | null>(null);
  const [loading, setLoading] = React.useState(true);

  async function loadDepartment() {
    try {
      const res = await DepartamentService.getByUserId();

      console.log(res)
      setDepartmentInfo(res[0]);
    } catch (e: any) {
      if(e.status =404) return  Alert.alert("Erro", "Usuario nao possui departamento cadastrado ");
      const msg =
        e?.message === "Tempo limite excedido"
          ? "Conexão lenta/instável. Tente novamente."
          : "Não foi possível carregar as informações.";
      Alert.alert("Erro de conexão", msg);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadDepartment();
  }, []);

  return (
    <>
    <AppHeader userName="Lydia" onLogout={() => console.log("Sair")} />
      <View style={[s.container, { backgroundColor: hardBg }]}>
      

      <ScrollView
        contentContainerStyle={[s.body, s.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[s.sectionTitle, { color: hardText, textAlign: "center" }]}>
          Departamento & Time
        </Text>

        {loading ? (
          <View style={{ marginTop: 32 }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : departmentInfo ? (
          <View
            style={[
              s.card,
              {
                backgroundColor: hardBg,
                borderColor: hardBorder,
                marginTop: 16,
              },
            ]}
          >
            <Text style={[s.cardTitle, { color: hardText }]}>
              Departamento:{" "}
              <Text style={{ color: hardMuted }}>{departmentInfo.department}</Text>
            </Text>
            <Text style={[s.cardTitle, { color: hardText }]}>
              Time: <Text style={{ color: hardMuted }}>{departmentInfo.team}</Text>
            </Text>
            <Text style={[s.cardTitle, { color: hardText }]}>
              Gerente:{" "}
              <Text style={{ color: hardMuted }}>{departmentInfo.manager}</Text>
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: 32, alignItems: "center" }}>
            <Text style={[s.cardSubtitle, { color: hardMuted, textAlign: "center" }]}>
              Aguarde o RH cadastrar você no departamento e time
            </Text>
          </View>
        )}
      </ScrollView>
    </View>

    </>
    
  );

}