import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import QuizScreen from './QuizScreen'
import Login from './Login'
import { StatusBar } from 'expo-status-bar'
import { useSession } from '../zus-store/session-store'
import Profile from './Profile'

const queryClient = new QueryClient()

const Stack = createNativeStackNavigator()

const Tab = createBottomTabNavigator()

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  )
}

function RootStack() {
  const sessionUserId = useSession((s) => s.userId)

  return (
    <Stack.Navigator>
      {sessionUserId ? (
        <Stack.Screen
          name="Tabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootStack />
        <StatusBar style="auto" />
      </NavigationContainer>
    </QueryClientProvider>
  )
}
