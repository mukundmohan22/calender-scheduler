import React from 'react';
import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import "../css/MonthCalendar.css"

export default function MonthCalendar(props){
   
        const mDays = { weekday: 'narrow' };
        return(
              <Calendar
                header={{
                    left: "prev",
                    center : "title",
                    right: " next"
                }}
                columnHeaderFormat= {mDays}
                dayRender={props.dayRenderEvent}
                selectable="true"
                height = "auto"
                dateClick={props.handleDateClick}
                defaultView="dayGridMonth"
                plugins={[ dayGridPlugin ,interactionPlugin ]} />
        )
    
}