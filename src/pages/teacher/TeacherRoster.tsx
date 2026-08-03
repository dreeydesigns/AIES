import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/shared/EmptyState';
import { Users } from 'lucide-react';

export default function TeacherRoster() {
  const navigate = useNavigate();
  const { users } = useAppContext();
  
  const students = users.filter(u => u.role === 'student');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Student Roster</h2>
          <p className="text-neutral-500">Manage and monitor all students.</p>
        </div>
      </div>
      
      {students.length === 0 ? (
        <EmptyState 
          icon={Users}
          title="No Students Found"
          description="There are currently no students in your roster."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Streak</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Linked Guardian</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {students.map(student => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-neutral-50 cursor-pointer"
                    onClick={() => navigate(`/teacher/students/${student.id}`)}
                  >
                    <td className="px-6 py-4 font-medium text-blue-600 hover:underline">{student.name}</td>
                    <td className="px-6 py-4 font-bold text-neutral-700">{student.points || 0}</td>
                    <td className="px-6 py-4 text-neutral-600">{student.level || 1}</td>
                    <td className="px-6 py-4 text-neutral-600">{student.streak || 0} days</td>
                    <td className="px-6 py-4 text-neutral-600 text-sm">
                      {student.parentIds && student.parentIds.length > 0 ? (
                        (() => {
                          const parent = users.find(u => u.id === student.parentIds?.[0]);
                          return parent ? parent.name : 'Unknown Parent';
                        })()
                      ) : (
                        <span className="text-neutral-400 italic">Not linked yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          navigate(`/teacher/students/${student.id}`);
                        }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        View Report
                      </button>
                      {student.parentIds && student.parentIds.length > 0 && (
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/teacher/messages?contactId=${student.parentIds[0]}`);
                          }}
                          className="ml-4 text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors"
                        >
                          Message Parent
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
