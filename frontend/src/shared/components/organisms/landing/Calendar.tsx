import React from 'react';
import { ChevronRight } from 'lucide-react';
import './style/Calendar.css';

const Calendar = () => {
    const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const dates = [
        ['01', '02', '03', '04', '05', '06', '07'],
        ['08', '09', '10', '11', '12', '13', '14'],
        ['15', '16', '17', '18', '19', '20', '21'],
        ['22', '23', '24', '25', '26', '27', '28'],
        ['29', '30', '31', '01', '02', '03', '04']
    ];

    return (
        <div className="calendar-section">
            <div className="calendar-header">
                <h3>Disponibilités & Calendrier</h3>
                <div className="calendar-month">
                    <span>Avril 2024</span>
                    <ChevronRight size={16} />
                </div>
            </div>

            <div className="calendar-grid">
                <div className="calendar-days">
                    {days.map((day, index) => (
                        <div key={index} className="calendar-day-header">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="calendar-dates">
                    {dates.map((week, weekIndex) => (
                        <div key={weekIndex} className="calendar-week">
                            {week.map((date, dateIndex) => (
                                <div
                                    key={dateIndex}
                                    className={`calendar-date ${date === '17' ? 'today' : ''} ${date === '18' || date === '16' ? 'has-event' : ''}`}
                                >
                                    {date}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;