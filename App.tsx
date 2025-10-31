import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PairingScreen from "./src/screens/PairingScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ReportIncidentScreen from "./src/screens/ReportIncidentScreen";
import Launcher from "./src/screens/Launcher";
import HostedDemoScreen from "./src/screens/HostedDemo";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Report" component={ReportIncidentScreen} />
        <Tab.Screen name="Pair" component={PairingScreen} />
        <Tab.Screen name="Launcher" component={Launcher} />
        <Tab.Screen name="HostedDemo" component={HostedDemoScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
