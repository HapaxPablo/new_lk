'use client'

import React, { JSX, useState } from 'react'
import {
  Image,
  PlayCircle,
  CheckCircle,
  FileText,
  Users,
  Phone,
} from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon: JSX.Element
  count: number
}

const tabs: Tab[] = [
  { id: 'photos', label: 'Фото', icon: <Image size={16} />, count: 49 },
  { id: 'videos', label: 'Ролики', icon: <PlayCircle size={16} />, count: 247 },
  { id: 'tasks', label: 'Задачи', icon: <CheckCircle size={16} />, count: 3 },
  { id: 'media', label: 'Медиапланы', icon: <FileText size={16} />, count: 16 },
  { id: 'renters', label: 'Арендаторы', icon: <Users size={16} />, count: 50 },
  { id: 'contacts', label: 'Контакты', icon: <Phone size={16} />, count: 3 },
]

export function TabsWrapper() {
  const [activeTab, setActiveTab] = useState('photos')
  return (
    <div className="p-4">
      {/* Вкладки */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm transition
              ${
                activeTab === tab.id
                  ? 'border-red-400 text-red-500 bg-red-50'
                  : 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50'
              }`}
          >
            {tab.icon}
            {tab.label}
            <span className="ml-1 text-gray-400">{tab.count}</span>
          </button>
        ))}
      </div>
      Заглушки контента
      <div className="p-4 border rounded-lg bg-gray-50 text-gray-700">
        {activeTab === 'photos' && <p>📷 Тут будут фото</p>}
        {activeTab === 'videos' && <p>🎬 Тут будут ролики</p>}
        {activeTab === 'tasks' && <p>✅ Тут будут задачи</p>}
        {activeTab === 'media' && <p>📑 Тут будут медиапланы</p>}
        {activeTab === 'renters' && <p>👥 Тут будут арендаторы</p>}
        {activeTab === 'contacts' && <p>📞 Тут будут контакты</p>}
      </div>
    </div>
  )
}
