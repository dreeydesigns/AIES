const fs = require('fs');
let code = fs.readFileSync('src/pages/teacher/StudentDetail.tsx', 'utf8');

code = code.replace(/<button[\s\S]*?onClick=\{[\s\S]*?navigate\('\/teacher\/messages'\)\}[\s\S]*?Message Parent\/Student\n        <\/button>/, `<div className="flex flex-col gap-2">
          <button 
            onClick={() => navigate(\`/teacher/messages?contactId=\${student.id}\`)}
            className="px-6 py-2 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Message Student
          </button>
          {student.parentIds && student.parentIds.length > 0 && (
            <button 
              onClick={() => navigate(\`/teacher/messages?contactId=\${student.parentIds[0]}\`)}
              className="px-6 py-2 bg-amber-50 text-amber-700 font-bold rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-2 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Message Parent
            </button>
          )}
        </div>`);

fs.writeFileSync('src/pages/teacher/StudentDetail.tsx', code);
