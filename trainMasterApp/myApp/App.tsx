import "react-native-gesture-handler";
import {
  NavigationContainer,
  DarkTheme as NavDark,
  DefaultTheme as NavLight,
  Theme as NavTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  ThemeProvider,
  useAppTheme,
} from "./src/components/theme/ThemeProvider";
import LoginScreen from "./src/screens/LoginScreen";
import RecoverPasswordScreen from "./src/screens/RecoverPasswordScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import RootTabs from "./src/components/navigation/RootTabs";
import "react-native-reanimated";
import FaqScreen from "./src/screens/FaqScreen";
import ExamOverView from "./src/screens/ExamOverView";
import DepartmentScreen from "./src/screens/Department";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { theme } = useAppTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.text,
        drawerStyle: {
          backgroundColor: theme.colors.card,
        },
      }}
      initialRouteName="HomeTabs"
    >
      <Drawer.Screen
        name="HomeTabs"
        component={RootTabs}
        options={{ title: "Início" }}
      />

      <Drawer.Screen
        name="ExamOverView"
        component={ExamOverView}
        options={{ title: "Provas" }}
      />

      <Drawer.Screen
        name="FaqScreen"
        component={FaqScreen}
        options={{ title: "Perguntas frequentes" }}
      />

      <Drawer.Screen
        name="Department"
        component={DepartmentScreen}
        options={{ title: "Departamento" }}>
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

function ThemedNavigation() {
  const { theme } = useAppTheme();
  const base = theme.name === "dark" ? NavDark : NavLight;
  const hardBg = theme.name === "dark" ? "#000000" : "#FFFFFF";

  const navTheme: NavTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: hardBg,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.primary,
      notification: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Entrar"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: hardBg },
          headerStyle: { backgroundColor: theme.colors.card },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen name="App" component={DrawerNavigator} />
        <Stack.Screen name="Entrar" component={LoginScreen} />
        <Stack.Screen name="Recover" component={RecoverPasswordScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
