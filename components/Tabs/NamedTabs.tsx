'use client'

import React from 'react'
import {
  Image,
  PlayCircle,
  CheckCircle,
  FileText,
  Users,
  Phone,
} from 'lucide-react'
import { Tabs, TabItem } from './Tabs'
import { INomenclatureDetailsItem, ITenantsResponse } from '@/types/nomenclature'
import {
  PhotosTabContent,
  VideosTabContent,
  TasksTabContent,
  MediaPlansTabContent,
  RentersTabContent,
  ContactsTabContent,
} from './content'

interface NamedTabsProps {
  item: INomenclatureDetailsItem
  initialTenantsData?: ITenantsResponse | null
}

export const NamedTabs = ({ item, initialTenantsData }: NamedTabsProps) => {
  if (!item) {
    return (
      <div
        style={{
          padding: '1rem',
          textAlign: 'center',
          color: 'var(--second-text-color)',
        }}
      >
        Данные для отображения отсутствуют
      </div>
    )
  }

  const { tenants_length = 0, exterior = [], interior = [] } = item

  const exteriorCount = exterior.length
  const interiorCount = interior.length
  const totalPhotos = exteriorCount + interiorCount

  const tabs: TabItem[] = [
    {
      id: 'renters',
      label: 'Арендаторы',
      icon: <Users size={16} />,
      count: tenants_length,
      content: <RentersTabContent nomenclatureId={item.id} initialTenantsData={initialTenantsData} />,
      visual: tenants_length > 0 ? true : false,
    },
    {
      id: 'photos',
      label: 'Фото',
      icon: <Image size={16} />,
      count: totalPhotos,
      content: <PhotosTabContent exterior={exterior} interior={interior} />,
      visual: false,
    },
    {
      id: 'videos',
      label: 'Ролики',
      icon: <PlayCircle size={16} />,
      count: 0,
      content: <VideosTabContent />,
      visual: false,
    },

    {
      id: 'tasks',
      label: 'Задачи',
      icon: <CheckCircle size={16} />,
      count: 0,
      content: <TasksTabContent />,
      visual: false,
    },
    {
      id: 'media',
      label: 'Медиапланы',
      icon: <FileText size={16} />,
      count: 0,
      content: <MediaPlansTabContent />,
      visual: false,
    },

    {
      id: 'contacts',
      label: 'Контакты',
      icon: <Phone size={16} />,
      count: 0,
      content: <ContactsTabContent />,
      visual: false,
    },
  ]

  return <Tabs items={tabs} defaultTab="renters" />
}
