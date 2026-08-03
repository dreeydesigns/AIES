const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const authScreenRegex = /function AuthScreen\(\) \{[\s\S]*?(?=function AppContent\(\) \{)/;
code = code.replace(authScreenRegex, '');

code = code.replace(/import EmptyState from '\.\/components\/shared\/EmptyState';/, `import EmptyState from './components/shared/EmptyState';
import AuthScreen from './components/auth/AuthScreen';
import AdminConsole from './components/auth/AdminConsole';
import Onboarding from './components/auth/Onboarding';
import ParentReport from './pages/parent/ParentReport';`);

code = code.replace(/<Route path="\/" element=\{<AuthScreen \/>\} \/>/, `<Route path="/" element={<AuthScreen />} />
      <Route path="/admin-console" element={<AdminConsole />} />
      <Route path="/onboarding" element={<Onboarding />} />`);

code = code.replace(/<Route path="children" element=\{<ParentChildren \/>\} \/>/, `<Route path="children" element={<ParentChildren />} />
        <Route path="children/:studentId/report" element={<ParentReport />} />`);

fs.writeFileSync('src/App.tsx', code);
