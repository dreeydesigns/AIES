const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import StudentCourses from '\.\/pages\/student\/StudentCourses';/, `import StudentCourses from './pages/student/StudentCourses';\nimport StudentSettings from './pages/student/StudentSettings';`);

code = code.replace(/<Route path="labs" element=\{<div className="pt-6"><EmptyState icon=\{FolderX\} title="VR Labs" description="No content available." \/><\/div>\} \/>/, `<Route path="labs" element={<div className="pt-6"><EmptyState icon={FolderX} title="VR Labs" description="No content available." /></div>} />\n        <Route path="settings" element={<StudentSettings />} />`);

fs.writeFileSync('src/App.tsx', code);
