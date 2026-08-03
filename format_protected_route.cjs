const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/if \(!currentUser\) \{\n    return <Navigate to="\/" state=\{\{ from: location \}\} replace \/>;\n  \}/, `if (!currentUser) {
    if (allowedRole === 'admin') {
      return <Navigate to="/admin-console" state={{ from: location }} replace />;
    }
    return <Navigate to="/" state={{ from: location }} replace />;
  }`);

code = code.replace(/if \(currentUser\.role !== allowedRole\) \{\n    return <Navigate to=\{\`\/\$\{currentUser\.role\}\`\} replace \/>;\n  \}/, `if (currentUser.role !== allowedRole) {
    if (allowedRole === 'admin') {
      return <Navigate to="/admin-console" replace />;
    }
    return <Navigate to={\`/\${currentUser.role}\`} replace />;
  }`);

fs.writeFileSync('src/App.tsx', code);
