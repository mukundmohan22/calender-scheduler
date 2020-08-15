import React from 'react';
import "./popup.scss";
import "../css/Popup.css"

export default function popup(props) {

    let mode = props.popupMode;
    let title = "Schedule Appointment";
    let button = <button className="btn-primary" onClick={props.confirmAppointment}>Confirm</button>;
    if ("view" === mode) {
        title = "View / Cancel Appointment"
        button = <button className="btn-primary" onClick={props.cancelAppointment}>Cancel Appointment</button>;
    }
    return (
        
        
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    {title}
                </div>
                <div className="modal-body content">
                    <div className="grid-container">
                        <div className="grid-item modal-label">Candidate Name</div>
                        <div className="grid-item">{props.candidateDetails.CandidateName}</div>
                        <div className="grid-item modal-label">Requisition</div>
                        <div className="grid-item">{props.candidateDetails.ReqNumber}</div>
                        <div className="grid-item modal-label">Start Date</div>
                        <div className="grid-item">{props.startTime}</div>
                        <div className="grid-item modal-label">End Date</div>
                        <div className="grid-item">{props.endTime}</div>
                        <div className="grid-item modal-label">Facility</div>
                        <div className="grid-item">{props.candidateDetails.LocationName}</div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-primary inverted" onClick={props.cancelAppointment}
                        >Cancel
                            </button>
                    
                    {button}

                </div>
            </div>
        </div>
    )

}