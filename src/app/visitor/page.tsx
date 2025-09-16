// "use client";

// import { useAuth } from '../context/AuthContext';
// import { Box, Typography, Button, Paper, Container, Alert, Chip, Card, CardContent } from '@mui/material';
// import { useState } from 'react';
// import supabase from '../../../lib/supabaseClient';


//  function VisitorDashboard() {
//   const { user, role, signOut, refreshAuth, loading } = useAuth();
//   const [debugInfo, setDebugInfo] = useState<string>('');
//   const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

//   // const handleRefresh = async () => {
//   //   setDebugInfo('Refreshing auth state...');
//   //   await refreshAuth();
//   //   setLastRefresh(new Date());
//   //   setDebugInfo('Auth state refreshed at ' + new Date().toLocaleTimeString());
//   // };

//   // const checkDatabaseDirectly = async () => {
//   //   if (!user) return;
    
//   //   setDebugInfo('Checking database directly...');
//   //   try {
//   //     const { data, error } = await supabase
//   //       .from('profiles')
//   //       .select('role')
//   //       .eq('user_id', user.id)
//   //       .single();

//   //     if (error) {
//   //       setDebugInfo('Error: ' + error.message);
//   //       return;
//   //     }

//   //     if (data) {
//   //       setDebugInfo(`Database shows role: ${data.role}, Current context role: ${role}`);
//   //       if (data.role !== role) {
//   //         setDebugInfo('Roles mismatch! Refreshing...');
//   //         await refreshAuth();
//   //       }
//   //     }
//   //   } catch (error) {
//   //     setDebugInfo('Error checking database: ' + error);
//   //   }
//   // };



 

//   if (loading) {
//     return (
//       <Container maxWidth="lg">
//         <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
//           <Typography>Loading...</Typography>
//         </Box>
//       </Container>
//     );
//   }

//   return (
   
//       <Container maxWidth="lg">
//         <Box sx={{ py: 4 }}>
//           <Paper sx={{ p: 4, mb: 3 }}>
//             <Typography variant="h4" gutterBottom>Dashboard</Typography>
//             <Typography variant="body1" gutterBottom>Welcome, {user?.email}</Typography>
            
//             {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
//               <Typography variant="body2">Current Role:</Typography>
//               <Chip 
//                 label={role.toUpperCase()} 
//                 color={getRoleColor(role) as any} 
//                 variant="filled"
//                 size="medium"
//               />
//             </Box> */}

//             {/* {lastRefresh && (
//               <Alert severity="info" sx={{ mb: 2 }}>
//                 Last refresh: {lastRefresh.toLocaleTimeString()}
//               </Alert>
//             )} */}

//             {/* <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
//               <Button variant="contained" onClick={handleRefresh}>
//                 Refresh Auth State
//               </Button>
//               <Button variant="outlined" onClick={checkDatabaseDirectly}>
//                 Check Database
//               </Button>
//               <Button variant="outlined" onClick={forceRoleUpdate}>
//                 Force Role Update
//               </Button>
//               <Button variant="contained" color="error" onClick={signOut}>
//                 Sign Out
//               </Button>
//             </Box> */}

//             {/* {debugInfo && (
//               <Card variant="outlined" sx={{ mb: 2 }}>
//                 <CardContent>
//                   <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
//                     {debugInfo}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             )} */}

//             {/* <Alert severity="warning" sx={{ mb: 2 }}>
//               <Typography variant="body2">
//                 <strong>Important:</strong> If you updated your role via SQL editor, 
//                 you need to sign out and sign back in for the changes to take effect.
//               </Typography>
//             </Alert> */}

//             {/* <Alert severity="info">
//               <Typography variant="body2">
//                 <strong>Debug Info:</strong> Your user ID is: {user?.id}
//               </Typography>
//             </Alert>
//           </Paper> */}

//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom>Quick Fixes:</Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Button 
//                 variant="outlined" 
//                 onClick={() => window.location.reload()}
//                 sx={{ justifyContent: 'flex-start' }}
//               >
//                 1. Reload Page
//               </Button>
//               {/* <Button 
//                 variant="outlined" 
//                 onClick={signOut}
//                 sx={{ justifyContent: 'flex-start' }}
//               >
//                 2. Sign Out & Sign Back In
//               </Button> */}
//               {/* <Button 
//                 variant="outlined" 
//                 onClick={() => {
//                   localStorage.clear();
//                   sessionStorage.clear();
//                   window.location.reload();
//                 }}
//                 sx={{ justifyContent: 'flex-start' }}
//               >
//                 3. Clear Storage & Reload
//               </Button> */}
//             </Box>
//           </Paper>
//         </Box>
//       </Container>
    
//   );
// }
// export default VisitorDashboard;
"use client";

import Router from 'next/router';
import supabase from '../../../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

 function VisitorDashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();

 

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [Router, user])
  return (
    
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Visitor Dashboard</Typography>
            <Typography variant="body1" gutterBottom>Welcome, {user?.email}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>Role: visitor</Typography>
            <Button variant="contained" color="error" onClick={signOut} sx={{ mt: 2 }}>Sign Out</Button>
          </Paper>
        </Box>
      </Container>
   
  );
}
export default VisitorDashboard
