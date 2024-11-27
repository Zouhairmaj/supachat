import React from 'react';
import { Users } from 'lucide-react';
import type { TeamMember } from '../../utils/teamMembers';

interface HeaderProps {
  teamMembers: TeamMember[];
}

export function Header({ teamMembers }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200/80 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Users className="w-5 h-5 text-primary-600" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Team Discussion</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex -space-x-2">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="relative w-8 h-8 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-105 hover:z-10"
                title={`${member.name} - ${member.role}`}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-full">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">{teamMembers.length} online</span>
          </div>
        </div>
      </div>
    </header>
  );
}