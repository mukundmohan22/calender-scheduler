import React from 'react';
import { Calendar, Views ,momentLocalizer} from 'react-big-calendar';
import events from '../Resources/events';
import holidays from '../Resources/holidays';
import moment from 'moment';

const propTypes = {}

export default class Calender extends React.Component{
  constructor(...args) {
    super(...args)
    this.state = { events }
  }

  

  handleSelect = ({ start, end }) => {
    let day = start.getDay();
    console.log("Day ",day);
  if(day !== 0 && day !== 6){
    console.log("opening popup");
    const title = window.prompt('New Event name')
    if (title)
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title,
          },
        ],
      })
    }
    else{
      window.alert("Can't Reserve a slot on weekends.Try some other day.");
      // let privateKey = "myKey";
      // let jwt = require('jsonwebtoken');
      let today = new Date();
      var newDateObj = moment(today).add(1, 'd').toDate();
      console.log(Math.floor(newDateObj / 1000));
      //
      //
      // var token = jwt.sign({ iss: 'ReactApplication', exp :  Math.floor(newDateObj / 1000)},privateKey);
      // console.log("jwt",token);

      // let privateKey = "myKey";
      // let payload = { "iss": "ReactApplication"};
      // let token = jwt.sign(payload, privateKey, { algorithm: 'RS256'});
      // console.log("jwt",token);

    }
  }
dayStyleGetter = (date) =>{
  let style = {
      backgroundColor: '#DCDCDC',
      opacity: 0.6,
  };
  holidays.forEach(value =>{
      if(value.day.getFullYear() ===
        date.getFullYear() && value.day.getMonth() ===
        date.getMonth() && value.day.getDay() === date.getDay()){
        return {
            style: style
        };
      }

  });
}

customSlotPropGetter = (date) =>{
  console.log("time",date);
  let day = date.getDay();
  
 if(day === 0 || day === 6){
    let style = {
        backgroundColor: '#FFCCCB',
        opacity: 0.6,
        border: '0px',
        display: 'block'
    };
    return {
        style: style
    };
  }
  
}
  eventStyleGetter = (event, start, end, isSelected) => {
    let style = {
        backgroundColor: event.color,
        borderRadius: '0px',
        color: 'black',
        border: '0px',
        display: 'block'
    };
    return {
        style: style
    };
}

  render() {
    const localizer = momentLocalizer(moment);

    
    let allViews = Object.keys(Views).map(k => Views[k])
    return (
      <div style={{marginTop: 20}}>
        <div >
          Candidate Details Panel
          <div className="grid-container">
            <div className="grid-item">Candidate Name</div>
            <div className="grid-item"></div>
            <div className="grid-item">Start Date</div>
            <div className="grid-item"></div>
            <div className="grid-item">End Date</div>
            <div className="grid-item"></div>
          </div>
        </div>
        <Calendar
        toolbar={false}
          localizer={localizer}
          style={{ height: 200,width : 300}}
          events={[]}
          defaultView={Views.MONTH}
          min={new Date(2019, 8, 0, 8, 0)} // 8.00 AM
          max={new Date(2019, 8, 0, 17, 0)} // Max will be 6.00 PM!
          scrollToTime={new Date(1970, 1, 1, 6)}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={this.handleSelect}
          eventPropGetter={this.eventStyleGetter}
          dayPropGetter={this.dayStyleGetter}
          slotPropGetter={this.customSlotPropGetter}
        />
        <Calendar
          localizer={localizer}
          style={{ height: 500}}
          events={this.state.events}
          showMultiDayTimes
          views={allViews}
          defaultView={Views.WEEK}
          min={new Date(2019, 8, 0, 8, 0)} // 8.00 AM
          max={new Date(2019, 8, 0, 17, 0)} // Max will be 6.00 PM!
          scrollToTime={new Date(1970, 1, 1, 6)}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={this.handleSelect}
          eventPropGetter={this.eventStyleGetter}
          dayPropGetter={this.dayStyleGetter}
          slotPropGetter={this.customSlotPropGetter}
        />
        </div>
    )
  }
}

Calender.propTypes = propTypes
