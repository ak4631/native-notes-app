// import { AuthProvider } from '@/context/AuthContext';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { supabase } from '@/lib/supabase';
// import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect, useState } from 'react';
// import 'react-native-reanimated';


// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });
//   const [authenticated,setAuthenticated] = useState<boolean | null>(null);
//   useEffect(()=>{
//     const checkAuth = async () =>{
//       const {data:{user}} = await supabase.auth.getUser();
//       setAuthenticated(!!user);
//     };

//     checkAuth();

//     const {data:listener} = supabase.auth.onAuthStateChange((event,session)=>{
//       setAuthenticated(!!session?.user);
//     });

//     return () =>{
//       listener?.subscription.unsubscribe();
//     };
//   },[]);

//   if (!loaded || authenticated === null) {
//     // Async font loading only occurs in development.
//     return null;
//   }

//   return (
//   //   // <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
//   //   <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DefaultTheme}>
//   //     <Stack>
//   //       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//   //       <Stack.Screen name="+not-found" />
//   //     </Stack>
//   //     <StatusBar style="auto" />
//   //   </ThemeProvider>
//   // );
//   <AuthProvider>
//     <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DefaultTheme}>
//         <Stack>
//           {authenticated ? (
//             <>
//               <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//             </>
//           ) : (
//             <>
//               <Stack.Screen name="auth/login" options={{ headerShown: false }} />
//               <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
//             </>
//           )}
//           <Stack.Screen name="+not-found" />
//         </Stack>
//         <StatusBar style="auto" />
//       </ThemeProvider>
//     </AuthProvider>
//   );
// }
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native';


export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <MainNavigator />
      </SafeAreaView>
    </AuthProvider>
  );
}

function MainNavigator() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/');   // which maps to (tabs)/index.tsx
      } else {
        router.replace('/login');  // which maps to (auth)/login.tsx
      }
    }
  }, [user, loading]);

  if (loading) {
    return null;
  }

  return <Slot />;
}
