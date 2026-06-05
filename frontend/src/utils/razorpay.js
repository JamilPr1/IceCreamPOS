import axios from "axios";
import { API_URL, MOCK_PAYMENTS } from "../config/api";

export const makePayment = async (amount, toastMsg) => {
    if (MOCK_PAYMENTS) {
        toastMsg({
            title: "Payment successful (local mock)",
            status: "success"
        });
        return;
    }

    const data = await axios.post(`${API_URL}/create-order`, { amount });

    var options = {
        "key": "rzp_test_fEzKbpdD1kPh8D",
        "amount": +data.data.amount,
        "currency": "PKR",
        "name": "Raghuveer Sain Co. Pvt Ltd",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": data.data.id,
        "handler": function (response) {
            window.navigator.vibrate(1000);
            toastMsg({
                title: `Payment successful`,
                status: "success"
            });
        },
        "prefill": {
            "name": "Raghuveer Sain",
            "email": "raghuveersain987@gmail.com",
            "contact": "+918440874898"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response){
            toastMsg({
                title: `Payment failed`,
                status: `${response.error.reason}`
            });
    });
    rzp1.open();
}
