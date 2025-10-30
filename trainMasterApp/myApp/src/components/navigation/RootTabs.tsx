// navigation/RootTabs.tsx
// -----------------------------------------------------------------------------
// Este arquivo cria o "Bottom Tab" (barra inferior) e define as telas de cada aba.
// Usamos o padrão "Stack por aba": cada aba tem um Stack interno.
// Vantagem: podemos navegar para telas de detalhe (ex.: CourseDetail) sem
// aparecer como item da Tab, mantendo a Tab visível.
// -----------------------------------------------------------------------------


import React, { useState } from "react";
import { View, Text, Modal, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation, NavigatorScreenParams } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import FooterMenu from "../footer/FooterMenu";
import HomeScreen from "../../screens/HomeScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import SearchScreen from "../../screens/SearchScreen";
import EnrolledCoursesScreen from "../../screens/EnrolledCoursesScreen";
import CourseDetailScreen from "../../screens/CourseDetailScreen"; // 👈 importa a tela de detalhes
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { DrawerParamList } from "./DrawerNavigator";
import QuestionFlowScreen, { QuestionFlowParams } from "../../screens/QuestionFlowScreen";
import ReviewAnswersScreen, { ReviewParams } from "../../screens/ReviewAnswersScreen";
import { Course } from "../../services";
import { CourseOverviewParams } from "../../screens/CourseOverviewScreen";
import CourseOverviewScreen from "../../screens/CourseOverviewScreen";  // import para tela de visão do curso


// 1) Tipos das rotas da Tab (nomes das abas)
export type TabParamList = {
  Inicio: undefined;
  Perfil: undefined;
  Aprendizado: undefined;
  Buscar: undefined;
  Menu: undefined;
};


// 2) Tab Navigator tipado
const Tab = createBottomTabNavigator<TabParamList>();


// 3) Stacks internos por aba ---------------------------------------------------
//    - Cada aba pode ter uma "home" + telas de detalhe.
//    - Assim, a Tab continua visível mesmo ao navegar pro detalhe.


// 3.1) Stack da aba "Aprendizado"
export type AprendizadoStackParamList = {
  AprendizadoHome: undefined;          // lista de cursos matriculados
  CourseDetail: { course: Course};        // detalhe do curso (não aparece na Tab)
  CourseOverview: CourseOverviewParams;
  QuestionFlow:QuestionFlowParams;
  ReviewAnswers: ReviewParams;
};
const AprendizadoStackNav = createNativeStackNavigator<AprendizadoStackParamList>();


function AprendizadoStack() {
  return (
    <AprendizadoStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AprendizadoStackNav.Screen
        name="AprendizadoHome"
        component={EnrolledCoursesScreen}
      />
      <AprendizadoStackNav.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
      />
      <AprendizadoStackNav.Screen
        name="CourseOverview"
        component={CourseOverviewScreen}
      />
       <AprendizadoStackNav.Screen
        name="QuestionFlow"
        component={QuestionFlowScreen}
      />
             <AprendizadoStackNav.Screen
        name="ReviewAnswers"
        component={ReviewAnswersScreen}
      />
    </AprendizadoStackNav.Navigator>
  );
}


// 3.2) Stack da aba "Buscar"
type BuscarStackParamList = {
  BuscarHome: undefined;
  Department: undefined;
  CourseDetail: { id: string };        // detalhe do curso (mesma tela)
};
const BuscarStackNav = createNativeStackNavigator<BuscarStackParamList>();


function BuscarStack() {
  return (
    <BuscarStackNav.Navigator screenOptions={{ headerShown: false }}>
      <BuscarStackNav.Screen name="BuscarHome" component={SearchScreen} />
      <BuscarStackNav.Screen name="CourseDetail" component={CourseDetailScreen} />
    </BuscarStackNav.Navigator>
  );
}


// 4) Telinha vazia para a aba "Menu" (a aba abre um modal com opções)
function MenuScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Menu</Text>
    </View>
  );
}


// 5) Tipo para ícones (auto-complete)
type IconName = React.ComponentProps<typeof Ionicons>["name"];


export default function RootTabs() {
  const [menuOpen, setMenuOpen] = useState(false);


  // 6) Queremos acionar rotas do Drawer a partir do modal:
  const drawerNav = useNavigation<DrawerNavigationProp<DrawerParamList>>();


  // 7) Helper: navegar para uma aba específica
  const goTab = (tab: keyof TabParamList) => () => {
    setMenuOpen(false);
    drawerNav.navigate("HomeTabs", { screen: tab }); // HomeTabs = Tab dentro do Drawer
  };


  // 8) Itens do modal de menu (ações rápidas)
  const items: { key: string; label: string; icon: IconName; onPress: () => void }[] = [
    { key: "home", label: "Home", icon: "home-outline", onPress: goTab("Inicio") },
    { key: "perfil", label: "Perfil", icon: "person-outline", onPress: goTab("Perfil") },
    { key: "aprendizado", label: "Aprendizado", icon: "book-outline", onPress: goTab("Aprendizado") },
    { key: "buscar", label: "Buscar", icon: "search-outline", onPress: goTab("Buscar") },
    {
      key: "faq",
      label: "Perguntas frequentes",
      icon: "help-circle-outline",
      onPress: () => { setMenuOpen(false); drawerNav.navigate("FaqScreen"); },
    },
    {
      key: "exam",
      label: "Provas",
      icon: "reader-outline",
      onPress: () => { setMenuOpen(false); drawerNav.navigate("ExamOverView"); },
    },
    {
      key: "departamento",
      label: "Departamento",
      icon: "business-outline",
      onPress: () => { setMenuOpen(false); drawerNav.navigate("Department"); },
    },
  ];


  return (
    <>
      {/* 9) Tab principal do app. Cada aba aponta para um Stack próprio. */}
      <Tab.Navigator
        initialRouteName="Inicio"
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <FooterMenu {...props} />} // usa o seu footer customizado
      >
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
        {/* 👇 Usa o stack no lugar da tela direta */}


        {/* Aba Aprendizado usa o Stack local: AprendizadoHome + CourseDetail */}
        <Tab.Screen
          name="Aprendizado"
          component={AprendizadoStack}
          options={{ tabBarLabel: "Aprendizado" }}
        />
        {/* Aba Buscar usa o Stack local: BuscarHome + CourseDetail */}
        <Tab.Screen
          name="Buscar"
          component={BuscarStack}
        />


        {/* A aba Menu apenas abre o modal abaixo (não navega de verdade) */}
        <Tab.Screen
          name="Menu"
          component={MenuScreen}
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // impede que a Tab troque de tela
              setMenuOpen(true);  // abre o modal
            },
          }}
          options={{ tabBarLabel: "Menu" }}
        />
      </Tab.Navigator>


      {/* 10) Modal do "Menu" com ações rápidas (vai para abas ou rotas do Drawer) */}
      <Modal
        visible={menuOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Menu</Text>


          <View style={styles.list}>
            {items.map((item, idx) => (
              <View key={item.key}>
                <TouchableOpacity style={styles.row} onPress={item.onPress}>
                  <Ionicons name={item.icon} size={22} style={styles.rowIcon} />
                  <Text style={styles.rowLabel}>{item.label}</Text>
                </TouchableOpacity>
                {idx < items.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}


const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)" },
  sheet: {
    backgroundColor: "#1f1f1f",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 24,
    paddingHorizontal: 16,
    minHeight: 360,
    maxHeight: "70%",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginBottom: 8,
  },
  sheetTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 8 },
  list: { backgroundColor: "transparent" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  rowIcon: { color: "rgba(255,255,255,0.9)", width: 28 },
  rowLabel: { color: "#fff", fontSize: 16, marginLeft: 6 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: "rgba(255,255,255,0.15)" },
});



