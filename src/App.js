import React from 'react';
import './App.scss';
import Header from './Component/Header.js'
import FullCalendar from './Component/FullCalendar.js'
import events from "./Resources/slots.json";
import 'react-notifications/lib/notifications.css';
import candidate from "./Resources/candidateDetails.json"

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      candidateDetails: candidate,
      calendarEvents: [],
      dayAvailability: [],
      firstName: '',
      lastName: '',
      isloading: true,
      apiError: false,
      errorMsg: ''
    }
  }


  /**
     * Lifecycle Method to fetch the event slot from DB and load the same to 
     * Calendar once the component finish rendering on the UI
     */
  componentDidMount() {
    // this.fetchCandidateDetails();
    this.setState(
      {
        items : events.items,
        calendarEvents: this.processAPIdata(events.items),
        isloading: false,

      })

    let ev = events.items;
    let date = new Date();
    let dayList = [];
    events.items.forEach(event => {
      if (date.getDay() !== new Date(event.StartDate).getDay()) {
        date = new Date(event.StartDate);
        let st = "Available";
        ev.forEach(e => {
          let d = new Date(e.StartDate);

          if (date.getDay() === d.getDay()) {
            if (!"Available" === e.Status) {
              st = "Booked"
            }
          }
        })
        dayList.push({
          "day": date,
          "status": st

        })
      }
    })


  }

  render() {

    if (this.state.isloading)
      return this.LoadingMessage();
    else if (this.state.apiError)
      return this.ErrorMessage();
    else
      return (
        <div className="App">
          <Header CandidateName={this.state.candidateDetails.CandidateName} />
          <FullCalendar candidateDetails={this.state.candidateDetails}
            calendarEvents={this.state.calendarEvents}
            dayAvailability={events.items} />
        </div>
      );
  }
  /**
   * Funcation to process the api response and create event array
   * from it.
   */
  processAPIdata = (slotDetails) => {
    let events = "";
    let desc = "Slot booked by other Candidate.";
    let title = "Booked"
    events = slotDetails.map(item => {
      let color = "red";
      if (item.Status === "Available") {
        color = "green";
        desc = "Slot available for booking.";
        title = "Available"
      }
      if (item.CandidateId === String(this.state.candidateDetails.CandidateId)) {
        color = "blue";
        desc = "Slot booked by you.Click on the slot to view / cancel appointment.";
      }
      return ({
        'id': item.BookingId,
        'start': new Date(item.StartDate),
        'end': new Date(item.EndDate),
        'title': title,
        'extendedProps': {
          'status': item.Status,
          'colorCode': color,
          'Desc': desc,
          'CandidateId': item.CandidateId
        }
      });
    });
    return events;
  }

  /**
* Funcation to process the api response and create event array
* from it.
*/
  processDayAvailabilityData = (slotDetails) => {
    let events = "";
    events = slotDetails.map(item => {
      return ({
        'day': item.Dateval,
        'status': item.Status,
      });
    });
    return events;
  }

  processStaticDataForDaysAv = (slotDetails) => {



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
      .then(response => {
        if (!response.ok) {
          this.handleException(response.statusText);
        }
        return response.json();
      })
      .then(json => {
        this.setState(
          {
            calendarEvents: this.processAPIdata(json.items),
            isloading: false,

          })
      })
      .catch(error => console.log(error));
  }

  /**
   * Funcation to Fetch Candidate Details via Rest Service Call
   */
  fetchCandidateDetails = () => {
    console.log("Entering fetchCandidateDetails");
    let jwt = this.fetchJWTToken();
    let url = '/excluded-apps/XXHcmRestServices-ViewController-context-root/restproxy/v1/canddetails';
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + jwt);
    headers.append("Content-type", "application/vnd.oracle.adf.resourceitem+json");
    fetch(url, { method: 'GET', headers: headers, })
      .then(response => {
        if (!response.ok) {
          this.handleException(response.statusText);
        }
        return response.json();
      })
      .then(json => {
        console.log("Candidate Deatils ", json);

        this.setState(
          {
            candidateDetails: json.items[0]
          })
      })
      .then(() => {
        console.log("Calling Event API after User Details is fetched.");
        this.fetchDayDetails();

      })
      .catch(error => console.log(error));
  }


  /**
  * Funcation to Fetch Candidate Details via Rest Service Call
  */
  fetchDayDetails = () => {
    console.log("Entering fetchDayDetails");
    let jwt = this.fetchJWTToken();
    let url = '/excluded-apps/XXHcmRestServices-ViewController-context-root/restproxy/v1/intoverview';
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + jwt);
    headers.append("Content-type", "application/vnd.oracle.adf.resourceitem+json");
    fetch(url, { method: 'GET', headers: headers, })
      .then(response => {
        if (!response.ok) {
          this.handleException(response.statusText);
        }
        return response.json();
      })
      .then(json => {
        console.log("Day Deatils ", json);

        this.setState(
          {
            dayAvailability: this.processDayAvailabilityData(json.items)
          })
      })
      .then(() => {
        console.log("Calling Event API after User Details is fetched.");
        this.getEventInformation();

      })
      .catch(error => console.log(error));
  }

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
  LoadingMessage = () => {
    return (
      <div className="App">
        {/* <div className="splash-screen">
          Wait a moment while we load your app.   
          <div className="loading-screen-container">
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>    
      </div> */}
        <div className="splash-screen">
          Wait a moment while we load your app.
          <div className="loading-dot">.</div>
        </div>
      </div>
    );
  }

  /**
   * 
   */
  ErrorMessage = () => {
    return (
      <div className="App">
        <Header />
        <div className="error-screen">
          Error Occured while loading data from API.
          <span>Deatils error : {this.state.errorMsg}</span>
        </div>
      </div>
    );

  }
  /**
   * 
   */
  handleException = (error) => {
    this.setState(
      {
        apiError: true,
        isloading: false,
        errorMsg: error
      });

  }
  /**
   * 
   * @param {*} error 
   * @param {*} info 
   */
  componentDidCatch(error, info) {
    console.log("entering componentDidCatch", error, info);
    this.setState(
      {
        apiError: true,
        isloading: false,
        errorMsg: error
      });

  }
}
export default App;
