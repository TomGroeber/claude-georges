import React, { useState, useEffect } from 'react';
import moment from 'moment'; 
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Api } from '../../api';
import 'moment/locale/fr';

moment.locale('fr');
const localizer = momentLocalizer(moment);

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(moment().month() + 1);
    const [currentYear, setCurrentYear] = useState(moment().year()); 

    const handleNavigate = (date) => {

        // Use moment to extract the correct month and year
        const newMonth = moment(date).month() + 1; // +1 because moment months are 0-indexed
        const newYear = moment(date).year();


        // Update state
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };
    const myEventsList = [
        {
            title: "Vivek Leave",
            start: new Date("2024-12-03T04:00:00.000Z"),
            end: new Date("2024-12-03T10:00:00.000Z")
        },
        {
            title: "Operation Overdrive",
            start: new Date("2024-12-01T05:30:00.000Z"),
            end: new Date("2024-12-15T07:30:00.000Z")
        },
        {
            title: "John Leave",
            start: new Date("2024-12-14T05:30:00.000Z"),
            end: new Date("2025-01-29T07:30:00.000Z")
        },
    ];

    const getEventData = () => {
        Api.getEvents(currentMonth,currentYear).then((res) => {
            if (res?.data?.meta?.code == 1) {
                const myEventsList = res?.data?.data.map(event => ({
                    title: event?.title,
                    start: new Date(event?.start),
                    end: new Date(event?.end),
                    status:event?.status || 'event',
                }));

                setEvents(myEventsList)
            }
        })
            .catch(err => {
                console.log(err);

            })
    }

    useEffect(() => {
        getEventData();
    }, [currentMonth,currentYear])

    const getEventColor = (status) => {
        switch (status) {
            case 'approved':
                return { style: { backgroundColor: 'green', color: 'white' } };  // Green for approved
            case 'pending':
                return { style: { backgroundColor: 'orange', color: 'black' } }; // Yellow for pending
            case 'rejected':
                return { style: { backgroundColor: 'red', color: 'white' } };   // Red for rejected
            case 'event':
                return { style: { backgroundColor: 'blue', color: 'white' } };   // Blue for event
            default:
                return { style: { backgroundColor: 'gray', color: 'white' } };   // Default gray if status is unknown
        }
    };

    const handleSelectSlot = (info) => {
        console.log(info)
    }

    const dayPropGetter = (date) => {
        const day = moment(date).day(); // Get the day of the week (0 = Sunday, 6 = Saturday)
        
     
        return {};
    };

    const frenchMessages = {
        next: 'Suivant',
        previous: 'Précédent',
        today: 'Aujourd\'hui',
        month: 'Mois',
        week: 'Semaine',
        day: 'Jour',
        agenda: 'Ordre du jour',
        emptyRange: "Il n'y a aucun événement dans cette période."
    };

    useEffect(() => {
        const observer = new MutationObserver((mutationsList) => {
            const emptyAgendaText = document.querySelector('.rbc-agenda-empty');
            if (emptyAgendaText) {
                emptyAgendaText.textContent = "Il n'y a aucun événement dans cette période."; // Custom French message
            }
        });

        // Start observing the DOM for changes in child nodes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => observer.disconnect();// Call the function to update the text when events change
    }, []);

    return (
        <div className='mt-6 mx-3 w-full h-[600px] flex-wrap lg:flex px-4 py-10 rounded-[10px] bg-white gap-4'>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%', width: '100%' }}
                onSelectSlot={handleSelectSlot}
                onNavigate={handleNavigate}
                dayPropGetter={dayPropGetter}
                eventPropGetter={(event) => getEventColor(event?.status)} // Apply custom color logic here
                culture="fr"
                messages={frenchMessages}
           />
        </div>
    );
};

export default Dashboard;
