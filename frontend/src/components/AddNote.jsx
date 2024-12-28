import React, { useContext, useState } from "react";
import noteContext from "../context/notes/notecontext";

const AddNote = () => {
  const context = useContext(noteContext);
  const [isloading, setIsloading] = useState(false)
  const { addPolicy } = context;


  const [policy, setPolicy] = useState({
    title: "",
    description: "",
    effectiveDate: "",
    expiryDate:"",
    monthlyContributionAmount: "",
    EmergencyFund: "",
    penaltyDetails:"",
  });

  const handleclick = (e) => {
    e.preventDefault();
    addPolicy(policy.title, policy.description, policy.effectiveDate, policy.expiryDate , policy.monthlyContributionAmount , policy.EmergencyFund , policy.penaltyDetails);
    setPolicy({ title: "", description: "", effectiveDate: "", expiryDate:"", monthlyContributionAmount: "", EmergencyFund: "" , penaltyDetails:"" });
  };
 

  const handlechange = (e) => {
    setPolicy({ ...policy, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-3 p-2 ">
      <div className="contact-messageme">
        <h1>Add Policy</h1>
      </div>
      <div className="contact-formcontainer">
        <form action="" method="post" name="myForm" id="myForm">
          <div className="contact-secoundrow">
            <input
              type="text"
              name="title"
              id="title"
              className="contact-background"
              placeholder="title"
              onChange={handlechange}
              minLength={5}
              required
              value={policy.title}
            />
            <br />
            <br />
            <textarea
              name="description"
              id="description"
              cols="30"
              rows="2"
              className="contact-background"
              placeholder="Description"
              onChange={handlechange}
              minLength={3}
              required
              value={policy.description}
            ></textarea>
            <br />

            <br />

            <input
              type="date"
              name="effectiveDate"
              id="effectiveDate"
              className="contact-background"
              placeholder="Effective Date"
              onChange={handlechange}
              value={policy.effectiveDate}
            />
            <br />
            <br />
            <input
              type="date"
              name="expiryDate"
              id="expiryDate"
              className="contact-background"
              placeholder="Expiry Date"
              onChange={handlechange}
              value={policy.expiryDate}
            />
            <br />
            <br />
            <input
              type="number"
              name="monthlyContributionAmount"
              id="monthlyContributionAmount"
              className="contact-background"
              placeholder="Premium Amount"
              onChange={handlechange}
              value={policy.monthlyContributionAmount}
            />
            <br />
            <br />
            <input
              type="number"
              name="EmergencyFund"
              id="emergencyFundLimit"
              className="contact-background"
              placeholder="Emergency Fund Limit"
              onChange={handlechange}
              value={policy.EmergencyFund}
            />
            <br />
            <br />
            <input
              type="text"
              name="penaltyDetails"
              id="penaltyDetails"
              className="contact-background"
              placeholder="penaltyDetails"
              onChange={handlechange}
              value={policy.penaltyDetails}
            />
            <br />
            <br />

            {isloading && <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
              </div>
            </div>}
            <br />
  
            <button
              type="submit"
              id="sendmessage"
              className="btn btn-primary"
              disabled={policy.title.length < 5 || policy.description.length < 5 || isloading}
              onClick={handleclick}
            >
              Create Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
