import React from 'react'
import FullCal from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import ReactTooltip from 'react-tooltip';
import MonthCalendar from "../Component/MonthCalendar.js";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import "../css/NotificationCenter.css";
import 'react-notifications/lib/notifications.css';
import Popup from "../Component/popup.js";
import "../css/FullCalendar.css";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

export default class FullCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dayAvailability: this.processDayList(props.calendarEvents),
      calendarEvents: props.calendarEvents,
      isPopupOpen: false,
      popupMode: "",
      candidateDetails: props.candidateDetails,
      startTime: "",
      start: "",
      end: "",
      title: "",
      endTime: "",
      notificationType: "",
      notificationMessage: "",
    }
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);


  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }


  updateDimensions = () => {
    let width = window.outerWidth;
    let calendarApi = this.calendarComponentRef.current.getApi();
    if (width > 600) {
      calendarApi.changeView("timeGridWeek");
      document.getElementById("mCal").style.display = "block";
      document.getElementById("wCal").style.display = "block";
      document.getElementById("backButton").style.display = "none";
    }
    else if (width <= 415) {
      calendarApi.changeView("timeGridDay");
      document.getElementById("mCal").style.display = "block";
      document.getElementById("wCal").style.display = "none";
      document.getElementById("backButton").style.display = "none";
    }
  };
  calendarComponentRef = React.createRef();

  showNotification = (type, message) => {
    switch (type) {
      case 'info':
        NotificationManager.info(message, '', 10000);
        break;
      case 'success':
        NotificationManager.success(message, '', 10000);
        break;
      case 'warning':
        NotificationManager.warning(message, '', 10000);
        break;
      case 'error':
        NotificationManager.error(message, '', 10000);
        break;
      default:
        break;
    }
  }

  render() {
    const wDays = { weekday: 'long', day: '2-digit', };
    return (
      <div style={{ marginTop: 20 }}>
        <div className="candidatePanelFont  card">
          <div className="card__header">Details</div>
          <div className="grid-container">
            <div className="grid-item label">Candidate Name</div>
            <div className="grid-item">{this.state.candidateDetails.CandidateName}</div>
            <div className="grid-item label">Requisition</div>
            <div className="grid-item">{this.state.candidateDetails.ReqNumber}</div>
            <div className="grid-item label">From</div>
            <div className="grid-item">{this.formatDateFromString(this.state.candidateDetails.StartDate)}</div>
            <div className="grid-item label">Job Title</div>
            <div className="grid-item">{this.state.candidateDetails.JobTitle}</div>
            <div className="grid-item label">To</div>
            <div className="grid-item">{this.formatDateFromString(this.state.candidateDetails.EndDate)}</div>
            <div className="grid-item label">Facility</div>
            <div className="grid-item">{this.state.candidateDetails.LocationName}</div>
          </div>
        </div>
        <div className="calendar-grid-container">
          <button id="backButton"
            className="backButton"
            onClick={this.backToMonthMode}> {'< Back'}
          </button>
          <div className="mCal" id="mCal">
            <MonthCalendar handleDateClick={this.handleDateClick} dayRenderEvent={this.dayRenderEvent} />
            <div className="Legend-grid">
              <div className="Legend-div">
                <div className="Blue">&nbsp;</div>
              </div>
              <div>Selected</div>
              <div className="Legend-div">
                <div className="Grey">&nbsp;</div>
              </div>
              <div> Not Available</div>
              <div className="Legend-div">
                <div className="Green">&nbsp;</div>
              </div>
              <div>Available</div>
              <div className="Legend-div">
                <div className="Red">&nbsp;</div>
              </div>
              <div>Booked</div>
            </div>
          </div>
          <div className="wCal" id="wCal">
            <FullCal
              header={{
                left: "today prev",
                center: "title",
                right: "next timeGridWeek timeGridDay"
              }}
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day',
                list: 'List'
              }}
              titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }}
              ref={this.calendarComponentRef}
              columnHeaderFormat={wDays}
              events={this.state.calendarEvents}
              eventRender={this.eventRendering}
              nowIndicator={true}
              height="auto"
              minTime="08:00"
              maxTime="18:00"
              slotDuration="00:30:00"
              displayEventTime={false}
              allDaySlot={false}
              weekends={false}
              defaultView="timeGridWeek"
              eventClick={this.handleSlotClick}
              eventPositioned={this.handleEventPositioned}
              plugins={[timeGridPlugin, interactionPlugin]} />
          </div>
        </div>
        {this.renderPopUp()}
        <hr />
        <NotificationContainer />
        <ReactTooltip />
      </div>
    )
  }


  renderPopUp = () => {
    if (this.state.isPopupOpen) {
      return <Popup
        startTime={this.state.startTime}
        endTime={this.state.endTime}
        candidateDetails={this.state.candidateDetails}
        confirmAppointment={this.confirmAppointment}
        popupMode={this.state.popupMode}
        cancelAppointment={this.cancelAppointment} />;
    }
  };

  /**
   * Funcation to Cancel the Appointment 
   */
  cancelAppointment = () => {
    console.log("cancelAppointment invoked...");
    const payload = {
      "name": "updateBookingData",
      "parameters": [
        {
          "BookingId": ""
        },
        {
          "CandidateId": ""
        },
        {
          "Status": "Cancelled"
        }
      ]
    }
    payload.parameters[0].BookingId = this.state.title;

    payload.parameters[1].CandidateId = this.state.candidateDetails.CandidateId;
    // this.postAppointmentInfo(payload, "Appointment Cancelled.");
    this.setState({ isPopupOpen: false });

  }

  /**
   * Funcation to add tooltip to the events
   */
  handleEventPositioned = (info) => {
    info.el.setAttribute("data-tip", info.event.extendedProps.Desc);
    ReactTooltip.rebuild();
  }
  /**
   * Funcation to render the day in month calendar with Custom Style
   */
  dayRenderEvent = (info) => {
    let dayList = this.state.dayAvailability;
    console.log("DayList ",dayList);
    
    dayList && dayList.forEach(function (dt) {
      let day = new Date(dt.day);
      if (day.getDate() === info.date.getDate() && day.getMonth() === info.date.getMonth() && day.getFullYear() === info.date.getFullYear()) {
        // console.log("dt.Status",dt.Status);
        
        if ("Available" === dt.Status) {
          info.el.className = " availableDays";
        } else {
          info.el.className = " bookedDays";
        }
      }
    })

    return info.el;
  }


  /**
   * Funcation to render the Event with Custom Style
   */
  eventRendering = (info) => {
    // var tooltip = new Tooltip(info.el, {
    //   title: info.event.extendedProps.description,
    //   placement: 'top',
    //   trigger: 'hover',
    //   container: 'body'
    // });
    if ("green" === info.event.extendedProps.colorCode) {
      info.el.className = "availableEvent fc-time-grid-event fc-event fc-start fc-end";
    }
    else if ("red" === info.event.extendedProps.colorCode) {
      info.el.className = "bookedEvent fc-time-grid-event fc-event fc-start fc-end";
    }
    else {
      info.el.className = "cSelectedEvent fc-time-grid-event fc-event fc-start fc-end";
    }
    return info.el
  }



  /**
   * Funcation to get the JWT token from session storage
   * if null then parse the URL to get the JWT token
   */
  fetchJWTToken = () => {
    let token = "";
    token = sessionStorage.getItem('jwtRA');
    if (token === null || token === 'null') {
      let url_string = window.location.href;
      let url = new URL(url_string);
      token = url.searchParams.get("jwt");
      sessionStorage.setItem("jwtRA", token);
    } else {
      token = sessionStorage.getItem('jwtRA');
    }
    return token;
  }
  /**
   * 
   */
  handleDateClick = event => {
    let width = window.outerWidth;
    let calendarApi = this.calendarComponentRef.current.getApi();
    if (width <= 415) {
      document.getElementById("mCal").style.display = "none";
      document.getElementById("wCal").style.display = "block";
      document.getElementById("backButton").style.display = "block";
      calendarApi.changeView("timeGridDay");
    }

    calendarApi.gotoDate(event.date);

  };

  /**
   * 
   */
  backToMonthMode = () => {
    document.getElementById("mCal").style.display = "block";
    document.getElementById("wCal").style.display = "none";
    document.getElementById("backButton").style.display = "none";
  }



  closeModal = () => {
    this.setState({
      isPopupOpen: false,
      startTime: "",
      start: "",
      end: "",
      title: "",
      endTime: ""
    });
  }

  processDayList = (slotDetails) => {
    let ev = slotDetails;
    let date = new Date();
    let dayList = [];
    slotDetails.forEach(event => {
      if (date.getDay() !== new Date(event.start).getDay()) {
        date = new Date(event.start);
        let st = "Available";
        ev.forEach(e => {
          let d = new Date(e.start);

          if (date.getDay() === d.getDay()) {
            if ("Booked" === e.extendedProps.status.toString()) {
              st = "Booked"
            }
          }
        })
        dayList.push({
          "day": date,
          "Status": st

        })
      }
    })
    return dayList;
  }


  handleSlotClick = info => {
    console.log(info.event.start);


    if ("Available" === info.event.extendedProps.status) {
      this.setState({
        isPopupOpen: true,
        popupMode: "booking",
        startTime: this.formatDate(info.event.start),
        start: info.event.start,
        end: info.event.end,
        title: info.event.id,
        endTime: this.formatDate(info.event.end)
      });
    } else {
      // if (info.event.extendedProps.CandidateId === String(this.state.candidateDetails.CandidateId)) {
        this.setState({
          isPopupOpen: true,
          popupMode: "view",
          startTime: this.formatDate(info.event.start),
          start: info.event.start,
          end: info.event.end,
          title: info.event.id,
          endTime: this.formatDate(info.event.end)
        });

      // }
      // else {
      //   this.showNotification("info", "Selected slot is already booked.\nPlease select an available slot and try again.");
      // }

    }
  };


  postAppointmentInfo = (payloadBody, msg) => {

    let jwt = this.fetchJWTToken();
    let url = '/excluded-apps/XXHcmRestServices-ViewController-context-root/restproxy/v1/intbooking';
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + jwt);
    headers.append('Content-Type', 'application/vnd.oracle.adf.action+json');

    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payloadBody)
    })
      .then(response => {
        console.log("Post Response", response);
        if (response.status === 200 || response.status === 201 || response.result === "Success") {
          this.showNotification("success", msg);
          this.getEventInformation();
          let calendarApi = this.calendarComponentRef.current.getApi();
          calendarApi.refetchEvents();
        } else {
          this.showNotification("error", "Error Occured while booking Appointment. Please try again later.")
        }
      })
      .catch(error => {
        console.log("Import Error ", error);
        this.showNotification("error", "Error Occured while booking Appointment. Please try again later.");
      });
  }

  /**
 * Funcation to process the api response and create event array
 * from it.
 */
  processAPIdata = (slotDetails) => {
    let events = "";
    events = slotDetails.map(item => {
      let color = "red";
      if (item.Status === "Available") {
        color = "green"
      }
      if (item.CandidateId === String(this.state.candidateDetails.CandidateId)) {
        color = "blue"
      }
      return ({
        'id': item.BookingId,
        'start': new Date(item.StartDate),
        'end': new Date(item.EndDate),
        'extendedProps': { 'status': item.Status, 'colorCode': color }
      });
    });
    return events;
  }

  /**
  * Function to get All the Available and Booked slot 
  * using Rest API call.
  */
  getEventInformation = () => {
    let jwt = this.fetchJWTToken();
    let url = '/excluded-apps/XXHcmRestServices-ViewController-context-root/restproxy/v1/intbooking';
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + jwt);
    headers.append("Content-type", "application/vnd.oracle.adf.resourceitem+json");
    fetch(url, { method: 'GET', headers: headers, })
      .then(response => response.json())
      .then(json => {
        this.setState(
          {
            calendarEvents: this.processAPIdata(json.items),

          })
      })
      .catch(error => console.log(error));
  }

  confirmAppointment = () => {
    console.log("confirmAppointment invoked...", this.state.title);
    const newList = this.state.calendarEvents.map((item) => {
      if (item.id.toString() === this.state.title) {
        const updatedItem = {
          ...item,
          title : "Booked",
          extendedProps: {
            CandidateId: null,
            Desc: "Slot booked by you.Click on the slot to view / cancel appointment.",
            colorCode: "blue",
            status: "Booked"
          }
        };
        console.log("updatedItem",updatedItem);
        return updatedItem;
      }
      return item;
    });
    console.log("newList", newList);
    this.setState({
      calendarEvents : newList
    })


    // setList(newList);


    // const payload = {
    //   "name": "updateBookingData",
    //   "parameters": [
    //     {
    //       "BookingId": ""
    //     },
    //     {
    //       "CandidateId": ""
    //     },
    //     {
    //       "Status": "Booked"
    //     }
    //   ]
    // }
    // payload.parameters[0].BookingId = this.state.title;

    // payload.parameters[1].CandidateId = this.state.candidateDetails.CandidateId;
    // this.postAppointmentInfo(payload, "Appointment Scheduled successfully.");
    this.setState({ isPopupOpen: false });
  }

  formatDateFromString = date => {

    let fDate = date && this.formatDate(new Date(date));
    return fDate;
  }

  formatDate = dateTime => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let formatted_date = this.appendLeadingZeroes(dateTime.getDate()) + "-" + months[dateTime.getMonth()] + "-" + dateTime.getFullYear() + " " + this.appendLeadingZeroes(dateTime.getHours()) + ":" + this.appendLeadingZeroes(dateTime.getMinutes()) + ":" + this.appendLeadingZeroes(dateTime.getSeconds())
    return formatted_date;
  };
  appendLeadingZeroes = (n) => {
    if (n <= 9) {
      return "0" + n;
    }
    return n
  }

}
