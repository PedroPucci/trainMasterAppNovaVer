// navigation/DrawerNavigator.tsx
// -----------------------------------------------------------------------------
// Este arquivo cria o "Drawer" (menu lateral). Ele envolve o Tab (HomeTabs)
// e pode ter outras entradas de nível superior (FAQ, Departamento, etc).
// -----------------------------------------------------------------------------

import React from "react";
import { createDrawerNavigator, DrawerNavigationOptions } from "@react-navigation/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import RootTabs from "./RootTabs";
import { useAppTheme } from "../../components/theme/ThemeProvider";
import { NavigatorScreenParams } from "@react-navigation/native";
import type { TabParamList } from "./RootTabs"; // caminho conforme o seu projeto

// 1) Tipos das rotas do Drawer (ajuda o TS a validar navegação/params)
export type DrawerParamList = {
  HomeTabs: NavigatorScreenParams<TabParamList>; // ← aceita { screen, params }
  Department: undefined; // Exemplo de rota que ainda não tem tela real
  FaqScreen: undefined;  // Pode adicionar depois
  ExamOverView: undefined;
};

// 2) Cria o Navigator do Drawer
const Drawer = createDrawerNavigator<DrawerParamList>();

// 3) Tela vazia temporária (placeholder) para rotas que ainda não existem
function EmptyScreen() {
  return null;
}

export default function DrawerNavigator() {
  const { theme } = useAppTheme();

  // Opções globais do Drawer
  const screenOptions: DrawerNavigationOptions = {
    headerShown: false,                 // Esconde o header nativo (usamos nosso próprio header)
    drawerType: "front",                // Tipo de movimento do Drawer
    drawerActiveTintColor: theme.colors.primary, // Cor do item selecionado
    drawerInactiveTintColor: theme.colors.text,  // Cor dos itens não selecionados
    drawerStyle: { backgroundColor: theme.colors.card }, // cor do fundo do Drawer
  };

  return (
    <Drawer.Navigator initialRouteName="HomeTabs" screenOptions={screenOptions}>
      {/* 4) Entrada do Drawer que abre nosso Tab Navigator (RootTabs) */}
      <Drawer.Screen
        name="HomeTabs"
        component={RootTabs}
        options={{
          title: "Início",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
