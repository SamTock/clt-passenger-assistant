let currentJourney = null;
let conversationStep = 0;

let passenger = {
    airline: "",
    flight: "",
    location: "",
    baggage: false
};

let surveyHelpful = null;


// ==============================
// BASIC CHAT FUNCTIONS
// ==============================

function addMessage(text, type = "assistant") {

    const chat = document.getElementById("chat");

    const message = document.createElement("div");

    message.className = `message ${type}`;

    message.innerHTML = text;

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;
}


function sendMessage() {

    const input = document.getElementById("userInput");

    const text = input.value.trim();

    if (!text) return;

    addMessage(text, "user");

    input.value = "";

    processMessage(text);
}


function handleEnter(event) {

    if (event.key === "Enter") {
        sendMessage();
    }
}


// ==============================
// START JOURNEY
// ==============================

function startJourney(type) {

    currentJourney = type;

    conversationStep = 0;

    surveyHelpful = null;


    if (type === "departure") {

        addMessage("I'm flying out of CLT.", "user");

        setTimeout(() => {

            addMessage(
                "Absolutely. I can help you plan your departure. What airline are you flying?"
            );

        }, 400);

        return;
    }


    if (type === "arrival") {

        addMessage("I'm arriving at CLT.", "user");

        setTimeout(() => {

            addMessage(
                "Great. What airline and flight number are you arriving on?"
            );

        }, 400);

        return;
    }


    if (type === "connection") {

        addMessage("I have a connection.", "user");

        setTimeout(() => {

            addMessage(
                "I can help you check your connection. What is your connecting flight number?"
            );

        }, 400);

        return;
    }


    if (type === "gate") {

        addMessage("I need to find my gate.", "user");

        setTimeout(() => {

            addMessage(
                "Sure. What airline are you flying?"
            );

        }, 400);

        return;
    }


    if (type === "baggage") {

        addMessage("I need help with baggage.", "user");

        setTimeout(() => {

            addMessage(
                "Are you looking for baggage claim, or is your checked bag missing?"
            );

        }, 400);

        return;
    }


    if (type === "transportation") {

        addMessage("I need transportation.", "user");

        setTimeout(() => {

            addMessage(`
                <strong>What transportation do you need?</strong>
                <br><br>

                🚗 Parking<br>
                🚕 Taxi<br>
                📱 Rideshare<br>
                🚙 Rental car<br>
                🚌 Public transportation<br>
                👋 Passenger pickup

                <br><br>

                <button class="action-button"
                    onclick="showSurvey()">
                    Finish & Give Feedback
                </button>
            `);

        }, 400);

        return;
    }
}


// ==============================
// PROCESS USER MESSAGES
// ==============================

function processMessage(text) {

    const lower = text.toLowerCase();


    // ------------------------------
    // DEPARTURE
    // ------------------------------

    if (currentJourney === "departure") {

        if (conversationStep === 0) {

            passenger.airline = text;

            conversationStep = 1;

            addMessage(
                "Thanks. What is your flight number?"
            );

            return;
        }


        if (conversationStep === 1) {

            passenger.flight = text;

            conversationStep = 2;

            addMessage(
                "Where are you right now?"
            );

            setTimeout(() => {

                addMessage(`
                    <div class="journey-card">

                        <strong>
                            Choose your current location:
                        </strong>

                        <br><br>

                        <button class="action-button"
                            onclick="chooseLocation('On my way to CLT')">
                            On my way to CLT
                        </button>

                        <button class="action-button"
                            onclick="chooseLocation('Before security')">
                            Before security
                        </button>

                        <button class="action-button"
                            onclick="chooseLocation('Past security')">
                            Past security
                        </button>

                        <button class="action-button"
                            onclick="chooseLocation('At my gate')">
                            At my gate
                        </button>

                    </div>
                `);

            }, 300);

            return;
        }
    }


    // ------------------------------
    // GATE
    // ------------------------------

    if (currentJourney === "gate") {

        if (conversationStep === 0) {

            passenger.airline = text;

            conversationStep = 1;

            addMessage(
                "Great. What is your flight number?"
            );

            return;
        }


        if (conversationStep === 1) {

            passenger.flight = text;

            showGate();

            return;
        }
    }


    // ------------------------------
    // ARRIVAL
    // ------------------------------

    if (currentJourney === "arrival") {

        if (conversationStep === 0) {

            passenger.flight = text;

            showArrival();

            return;
        }
    }


    // ------------------------------
    // CONNECTION
    // ------------------------------

    if (currentJourney === "connection") {

        if (conversationStep === 0) {

            passenger.flight = text;

            conversationStep = 1;

            addMessage(
                "Thanks. What is your departure or connecting flight number?"
            );

            return;
        }


        if (conversationStep === 1) {

            showConnection();

            return;
        }
    }


    // ------------------------------
    // GENERAL QUESTIONS
    // ------------------------------

    if (
        lower.includes("security") ||
        lower.includes("tsa")
    ) {

        addMessage(`
            <strong>Security at CLT</strong>

            <p>
                CLT has multiple security checkpoints.
            </p>

            <p>
                For this prototype, I'm showing general
                airport guidance. Always verify current
                checkpoint information before traveling.
            </p>

            <button class="action-button"
                onclick="showSurvey()">
                Finish & Give Feedback
            </button>
        `);

        return;
    }


    if (
        lower.includes("uber") ||
        lower.includes("rideshare")
    ) {

        addMessage(`
            <strong>Rideshare</strong>

            <p>
                CLT provides designated rideshare pickup
                areas.
            </p>

            <p>
                Follow airport signs for the current
                rideshare pickup location.
            </p>

            <button class="action-button"
                onclick="showSurvey()">
                Finish & Give Feedback
            </button>
        `);

        return;
    }


    if (
        lower.includes("bag") ||
        lower.includes("baggage")
    ) {

        addMessage(`
            <strong>Baggage</strong>

            <p>
                If you are arriving at CLT, follow signs
                for Baggage Claim after leaving the aircraft.
            </p>

            <p>
                If your checked bag is missing, contact
                your airline's baggage service.
            </p>

            <button class="action-button"
                onclick="showSurvey()">
                Finish & Give Feedback
            </button>
        `);

        return;
    }


    addMessage(`
        I can help you with:

        <br><br>

        ✈️ Flights<br>
        📍 Gates<br>
        🛂 Security<br>
        🧳 Baggage<br>
        🚗 Transportation<br>
        🔄 Connections<br>
        ♿ Accessibility

        <br><br>

        Try asking:
        <br>
        "Where is my gate?"
    `);
}


// ==============================
// CHOOSE LOCATION
// ==============================

function chooseLocation(location) {

    passenger.location = location;

    addMessage(location, "user");

    setTimeout(() => {

        showDeparturePlan();

    }, 300);
}


// ==============================
// SHOW GATE
// ==============================

function showGate() {

    addMessage(`
        <div class="gate-card">

            <div>YOUR CURRENT GATE</div>

            <div class="gate-number">
                B7
            </div>

            <div>
                Concourse B
            </div>

        </div>

        <div class="journey-card">

            <strong>Next step</strong>

            <p>
                Follow airport signs toward Concourse B
                and Gate B7.
            </p>

            <button class="action-button"
                onclick="showDirections()">
                Get Directions
            </button>

            <button class="action-button"
                onclick="showSurvey()">
                Finish & Give Feedback
            </button>

        </div>
    `);
}


// ==============================
// SHOW DEPARTURE PLAN
// ==============================

function showDeparturePlan() {

    addMessage(`
        <div class="journey-card">

            <h3>Your CLT Journey</h3>

            <div class="journey-step completed">
                ✓ Flight identified
            </div>

            <div class="journey-step completed">
                ✓ Airline: ${passenger.airline}
            </div>

            <div class="journey-step completed">
                ✓ Flight: ${passenger.flight}
            </div>

            <div class="journey-step completed">
                ✓ Current location: ${passenger.location}
            </div>

            <div class="journey-step current">
                → Security
            </div>

            <div class="journey-step">
                ○ Find gate
            </div>

            <div class="journey-step">
                ○ Boarding
            </div>

        </div>

        <div class="gate-card">

            <div>PROTOTYPE GATE</div>

            <div class="gate-number">
                B7
            </div>

            <div>
                Concourse B
            </div>

        </div>

        <div class="journey-card">

            <strong>Next step</strong>

            <p>
                Proceed through security and follow signs
                for Concourse B.
            </p>

            <button class="action-button"
                onclick="showDirections()">
                View Directions
            </button>

            <button class="action-button"
                onclick="showSurvey()">
                Finish & Give Feedback
            </button>

        </div>
    `);
}


// ==============================
// SHOW DIRECTIONS
// ==============================

function showDirections() {

    addMessage(`
        <div class="journey-card">

            <h3>Directions to Gate B7</h3>

            <p>
                📍 Current location:
                ${passenger.location || "Airport terminal"}
            </p>

            <p>
                → Proceed toward security.
            </p>

            <p>
                → After security, follow signs for
                Concourse B.
            </p>

            <p>
                → Continue toward Gate B7.
            </p>

            <button class="action-button"
                onclick="alert('Map feature coming next!')">
                Open Airport Map
            </button>

            <button class="action-button"
                onclick="showSurvey()">
                Finish & Give Feedback
            </button>

        </div>
    `);
}


// ==============================
// SHOW ARRIVAL
// ==============================

function showArrival() {

    addMessage(`
        <div class="journey-card">

            <h3>Arrival at CLT</h3>

            <div class="journey-step completed">
                ✓ Flight identified
            </div>

            <div class="journey-step current">
                → Exit aircraft
            </div>

            <div class="journey-step">
                ○ Baggage Claim
            </div>

            <div class="journey-step">
                ○ Ground Transportation
            </div>

        </div>

        <p>
            After leaving the aircraft, follow signs
            toward Baggage Claim if you have checked luggage.
        </p>

        <button class="action-button"
            onclick="showSurvey()">
            Finish & Give Feedback
        </button>
    `);
}


// ==============================
// SHOW CONNECTION
// ==============================

function showConnection() {

    addMessage(`
        <div class="journey-card">

            <h3>Connection Plan</h3>

            <p>
                ✈️ Arrival flight:
                ${passenger.flight}
            </p>

            <p>
                🔄 Connecting flight identified.
            </p>

            <p>
                For this prototype, your next step is
                to follow airport signs to your connecting
                gate and verify the current gate on airport
                displays.
            </p>

            <button class="action-button"
                onclick="showSurvey()">
                Finish & Give Feedback
            </button>

        </div>
    `);
}


// ==============================
// END-OF-JOURNEY SURVEY
// ==============================

function showSurvey() {

    surveyHelpful = null;

    addMessage(`
        <div class="journey-card" id="surveyCard">

            <h3>Quick Feedback</h3>

            <p>
                <strong>
                    1. Was this information helpful?
                </strong>
            </p>

            <button class="action-button"
                onclick="selectHelpful('Yes')">
                👍 Yes
            </button>

            <button class="action-button"
                onclick="selectHelpful('No')">
                👎 No
            </button>

            <br><br>

            <p>
                <strong>
                    2. Is there anything we could improve?
                </strong>
            </p>

            <textarea
                id="surveyFeedback"
                placeholder="Optional feedback..."
                style="
                    width: 100%;
                    min-height: 80px;
                    padding: 10px;
                    border: 1px solid #ccd5df;
                    border-radius: 8px;
                    font-family: inherit;
                    resize: vertical;
                ">
            </textarea>

            <br><br>

            <button class="action-button"
                onclick="submitSurvey()">
                Submit Feedback
            </button>

        </div>
    `);
}


function selectHelpful(answer) {

    surveyHelpful = answer;

    addMessage(
        answer === "Yes"
            ? "👍 Yes, this was helpful."
            : "👎 No, this was not helpful.",
        "user"
    );
}


function submitSurvey() {

    const feedbackBox =
        document.getElementById("surveyFeedback");

    const feedback = feedbackBox
        ? feedbackBox.value.trim()
        : "";

    if (surveyHelpful === null) {

        alert("Please select Yes or No.");

        return;
    }


    const surveyCard =
        document.getElementById("surveyCard");

    if (surveyCard) {
        surveyCard.remove();
    }


    if (feedback) {

        addMessage(
            feedback,
            "user"
        );
    }


    addMessage(`
        <strong>Thank you for your feedback!</strong>

        <p>
            Your feedback helps us improve the
            CLT passenger experience.
        </p>
    `);


    console.log("Survey response:", {
        journey: currentJourney,
        helpful: surveyHelpful,
        feedback: feedback
    });
}
