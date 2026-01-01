import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Button } from '../../components/Button';
import { BsChevronLeft, BsChevronRight, BsPlus } from 'react-icons/bs';

export const CalendarView: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dateRange = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="p-4 flex items-center justify-between bg-[var(--color-bg-primary)]">
                <h1 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h1>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={prevMonth}><BsChevronLeft /></Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth}><BsChevronRight /></Button>
                </div>
            </header>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2 text-center text-xs font-semibold text-gray-400 py-2 border-b border-gray-100">
                {dayLabels.map(day => <div key={day}>{day}</div>)}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 text-sm">
                {dateRange.map((day, i) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    return (
                        <div
                            key={day.toString()}
                            className={`min-h-[80px] border-b border-gray-100 p-1 relative ${!isCurrentMonth ? 'bg-gray-50 text-gray-300' : ''}`}
                            onClick={() => setSelectedDate(day)}
                        >
                            <div className={`
                                w-7 h-7 flex items-center justify-center rounded-full mb-1
                                ${isToday(day) ? 'bg-red-500 text-white' : ''}
                                ${isSelected && !isToday(day) ? 'bg-[var(--color-accent)] text-white' : ''}
                            `}>
                                {format(day, dateFormat)}
                            </div>

                            {/* Mock Event Dot */}
                            {i % 5 === 0 && (
                                <div className="text-[10px] truncate bg-blue-100 text-blue-600 px-1 rounded">
                                    Date Night
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="fixed bottom-20 right-4">
                <Button variant="primary" size="icon" className="w-14 h-14 rounded-full shadow-lg">
                    <BsPlus size={32} />
                </Button>
            </div>
        </div>
    );
};
