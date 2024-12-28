import React, { useContext } from "react";
import noteContext from "../context/notes/notecontext";

const NoteItem = (props) => {
    const context = useContext(noteContext);
    const { note, updateNote } = props;
    const currency = "INR"

    const formateDate = (date) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:5000/api/payments/create-payment-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem("token"),
                },
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || "Failed to create payment order");
            }
    
            // Step 2: Initialize Razorpay Checkout
            const options = {
                key: 'rzp_test_H6izJaVSloYZS9', // Replace with your Razorpay key
                amount: data.order.amount,
                currency: data.order.currency,
                name: "Policy Premium Payment",
                description: "Pay your monthly premium",
                order_id: data.order.id,
                handler: function (response) {
                    console.log("Payment successful:", response);
    
                    // Optionally inform the user about successful payment
                    alert("Payment successful!");
    
                    // (Optional) Confirm with the backend if needed
                    // You can call your server API to validate or fetch the latest data.
                },
                prefill: {
                    name: "John Doe", // Replace with dynamic user data
                    email: "johndoe@example.com", // Replace with dynamic user data
                    contact: "9999999999", // Replace with dynamic user data
                },
            };
    
            const rzp = new window.Razorpay(options);
    
            // Step 3: Handle Payment Failure
            rzp.on('payment.failed', function (response) {
                alert("Payment failed!");
                console.error("Payment failed:", response.error);
            });
    
            rzp.open();
        } catch (error) {
            console.error("Error during payment initialization:", error);
            alert("Payment initialization failed");
        }
    };
    

    return (
        <div className="item round-1 ">
            <div className="card text-center">
                <div className="card-header">Policy</div>
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>

                    <button className="btn btn-primary mx-2" onClick={() => { updateNote(note) }}>Edit Policy</button>
                    <button className="btn btn-success mx-2" onClick={handlePayment}>Pay Now</button>
                </div>
                <div className="card-footer text-muted">
                    Created At: {formateDate(note.createdAt)}
                </div>
                <div className="card-footer text-muted">
                    Last Updated At: {formateDate(note.updatedAt)}
                </div>
            </div>
        </div>
    );
};

export default NoteItem;
