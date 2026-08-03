const fs = require('fs');
let code = fs.readFileSync('src/layouts/SidebarLayout.tsx', 'utf8');

code = code.replace(/<aside className="w-full md:w-64 bg-white border-r border-neutral-200 flex-shrink-0 flex flex-col">/, `<aside className="w-full md:w-64 bg-white border-r border-neutral-200 flex-shrink-0 flex flex-col print:hidden">`);

fs.writeFileSync('src/layouts/SidebarLayout.tsx', code);
