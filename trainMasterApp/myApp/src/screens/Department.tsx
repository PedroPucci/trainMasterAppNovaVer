import * as React from "react";
import { View, Text, ScrollView } from "react-native";
import AppHeader from "../components/header/AppHeader";
import FooterMenu from "../components/footer/FooterMenu";
import { useAppTheme } from "../components/theme/ThemeProvider";
import { styles as s } from "./styles";
import { BASE_URL, fetchComTimeout } from "../components/routes/apiConfig";
import { Alert, ActivityIndicator } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";



const USER_ID = 1; 

type DepartmentProps = {
  department: string;
  team: string;
  manager: string;
};

export default function DepartmentScreen() {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = isDark ? "#FFFFFF" : "#000000";
  const hardMuted = isDark ? "#A3A3A3" : "#666666";
  const hardBorder = isDark ? "#222222" : "#E5E5E5";

  const [departmentInfo, setDepartmentInfo] = React.useState<DepartmentProps | null>(null);
  const [loading, setLoading] = React.useState(true);
  const Tab = createBottomTabNavigator();

  async function loadDepartment() {
    try {
      const url = `${BASE_URL}/api/departments/by-user/${USER_ID}`;
      const res = await fetchComTimeout(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      const raw = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(raw);
      } catch {}

      if (!res.ok) {
        const msg = data?.message || raw || `HTTP ${res.status}`;
        Alert.alert("Erro", msg);
        return;
      }

      const info: DepartmentProps = {
        department: data.departmentName ?? "Não informado",
        team: data.teamName ?? "Não informado",
        manager: data.managerName ?? "Não informado",
      };
      setDepartmentInfo(info);
    } catch (e: any) {
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