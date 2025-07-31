"use client"
import { useState } from 'react'

interface CalendarProps {
  selectedDates: {
    departure: string
    return: string
  }
  onDateSelect: (date: string, type: 'departure' | 'return') => void
  tripType: 'oneway' | 'roundtrip'
  minDate?: string
}

export default function Calendar({ selectedDates, onDateSelect, tripType, minDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  // Minimum après-demain pour Duffel API
  const today = new Date()
  const dayAfterTomorrow = new Date(today)
  dayAfterTomorrow.setDate(today.getDate() + 2)
  
  const minDateObj = minDate ? new Date(minDate) : dayAfterTomorrow
  // S'assurer que minDateObj est au début de la journée
  minDateObj.setHours(0, 0, 0, 0)

  // S'assurer que la date minimum est au moins après-demain
  if (minDateObj <= dayAfterTomorrow) {
    minDateObj.setTime(dayAfterTomorrow.getTime())
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Lundi = 0
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const isDateDisabled = (date: Date) => {
    return date < minDateObj
  }

  const isDateSelected = (dateStr: string) => {
    return selectedDates.departure === dateStr || selectedDates.return === dateStr
  }

  const isDateInRange = (dateStr: string) => {
    if (tripType === 'oneway' || !selectedDates.departure || !selectedDates.return) return false
    
    const date = new Date(dateStr)
    const depDate = new Date(selectedDates.departure)
    const retDate = new Date(selectedDates.return)
    
    return date > depDate && date < retDate
  }

  const handleDateClick = (dateStr: string) => {
    const clickedDate = new Date(dateStr)
    
    if (isDateDisabled(clickedDate)) return

    if (tripType === 'oneway') {
      onDateSelect(dateStr, 'departure')
      return
    }

    // Pour aller-retour
    if (!selectedDates.departure) {
      // Première sélection : définir le départ
      onDateSelect(dateStr, 'departure')
    } else if (selectedDates.departure && !selectedDates.return) {
      // Deuxième sélection
      const depDate = new Date(selectedDates.departure)
      if (clickedDate < depDate) {
        // Si la date cliquée est antérieure au départ, on reset
        onDateSelect(dateStr, 'departure')
      } else {
        // Sinon on définit le retour
        onDateSelect(dateStr, 'return')
      }
    } else if (selectedDates.departure && selectedDates.return) {
      // Les deux dates sont déjà sélectionnées, on reset avec la nouvelle date de départ
      onDateSelect(dateStr, 'departure')
    }
  }

  const renderMonth = (monthOffset: number) => {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1)
    const daysInMonth = getDaysInMonth(month)
    const firstDay = getFirstDayOfMonth(month)
    const monthName = month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

    const days = []
    
    // Jours vides au début
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-7 md:h-12"></div>)
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day)
      const dateStr = formatDate(date)
      const disabled = isDateDisabled(date)
      const selected = isDateSelected(dateStr)
      const inRange = isDateInRange(dateStr)
      const isHovered = hoveredDate === dateStr

      days.push(
        <button
          type="button"
          key={day}
          onClick={() => !disabled && handleDateClick(dateStr)}
          onMouseEnter={() => setHoveredDate(dateStr)}
          onMouseLeave={() => setHoveredDate(null)}
          disabled={disabled}
          className={`
            h-7 w-7 md:h-12 md:w-12 rounded text-xs md:text-sm font-medium transition-all duration-200
            ${disabled 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'hover:bg-green-100 cursor-pointer'
            }
            ${selected 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : ''
            }
            ${inRange || isHovered 
              ? 'bg-green-50 text-green-700' 
              : ''
            }
            ${!selected && !inRange && !isHovered && !disabled 
              ? 'text-gray-700 hover:text-green-600' 
              : ''
            }
          `}
        >
          {day}
        </button>
      )
    }

    return (
      <div className="flex-1">
        <div className="text-center font-semibold text-gray-800 mb-1 md:mb-4 capitalize text-xs md:text-base">
          {monthName}
        </div>
        
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1 md:mb-3">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="h-6 md:h-10 flex items-center justify-center text-xs md:text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {days}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-2xl p-2 md:p-6 w-full max-w-4xl mx-2 md:mx-0 max-h-screen md:max-h-none overflow-y-auto">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between mb-2 md:mb-6">
        <button
          type="button"
          onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          className="p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-xs md:text-lg font-semibold text-gray-800 text-center px-2">
          {tripType === 'roundtrip' ? 'Sélectionnez vos dates' : 'Sélectionnez votre date'}
        </div>
        
        <button
          type="button"
          onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          className="p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Affichage des deux mois côte à côte sur desktop, empilés sur mobile */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-12">
        {renderMonth(0)}
        {renderMonth(1)}
      </div>

      {/* Info sur les dates sélectionnées - Masqué sur mobile */}
      {tripType === 'roundtrip' && (
        <div className="hidden md:block mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-gray-500 mb-1">Départ</div>
              <div className="font-semibold text-green-600">
                {selectedDates.departure ? 
                  new Date(selectedDates.departure).toLocaleDateString('fr-FR', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short' 
                  }) : 
                  'Choisir'
                }
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 mb-1">Retour</div>
              <div className="font-semibold text-green-600">
                {selectedDates.return ? 
                  new Date(selectedDates.return).toLocaleDateString('fr-FR', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short' 
                  }) : 
                  'Choisir'
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 