const fs = require('fs');
let code = fs.readFileSync('src/pages/parent/ParentChildren.tsx', 'utf8');

code = code.replace(/<div className="grid grid-cols-1 md:grid-cols-2 gap-6">/, `{children.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold">!</div>
            <div>
              <p className="font-bold text-amber-900">You haven't linked a child yet.</p>
              <p className="text-sm text-amber-700">Enter their link code to get started tracking their progress.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/onboarding')} 
            className="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap"
          >
            Enter Link Code
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">`);

code = code.replace(/<button[\s\S]*?onClick=\{[\s\S]*?navigate\('\/parent\/messages'\)\}[\s\S]*?Message Teacher[\s\S]*?<\/button>/, `<button 
                onClick={() => navigate('/parent/messages')}
                className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-sm font-bold rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Message Teacher
              </button>
              <button 
                onClick={() => navigate(\`/parent/children/\${child.id}/report\`)}
                className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                View Full Report
              </button>`);

fs.writeFileSync('src/pages/parent/ParentChildren.tsx', code);
