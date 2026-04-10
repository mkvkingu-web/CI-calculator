// Set max date today to prevent future date selection
document.getElementById("startDate").max = new Date().toISOString().split("T")[0];

// Default rate configuration
const rateInput = document.getElementById("rate");
rateInput.value = 2.5;

// Reset rate to default when interest type changes
document.getElementById("interestType").addEventListener("change", () => {
    rateInput.value = 2.5;
});

// Format date → 08 April 2018
function formatNiceDate(dateObj) {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return `${day} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

function calculate() {
    const p = parseFloat(document.getElementById("principal").value);
    const rMonth = parseFloat(document.getElementById("rate").value);
    const dateInput = document.getElementById("startDate").value;
    const type = document.getElementById("interestType").value;

    if (isNaN(p) || isNaN(rMonth) || !dateInput) {
        alert("Fill all fields");
        return;
    }

    const start = new Date(dateInput);
    const today = new Date();

    document.getElementById("displayDate").innerText = formatNiceDate(start);

    // Duration calculation
    let y = today.getFullYear() - start.getFullYear();
    let m = today.getMonth() - start.getMonth();
    let d = today.getDate() - start.getDate();

    // Adjust for negative days/months
    if (d < 0) { m--; d += 30; }
    if (m < 0) { y--; m += 12; }

    let totalMonths = y * 12 + m + (d / 30);
    let amount = p;
    let explanation = "";

    // ======================
    // SIMPLE INTEREST
    // ======================
    if (type === "si") {
        let interest = p * (rMonth / 100) * totalMonths;
        amount = parseFloat((p + interest).toFixed(6));

        explanation = `<h4>Calculation (Simple Interest)</h4>
        SI = P × r × t<br>
        = ${p.toFixed(6)} × ${rMonth / 100} × (${Math.floor(totalMonths)} + (${d}/30))<br>
        = ₹ ${interest.toFixed(6)}`;
    }

    // ======================
    // CI ANNUALLY
    // ======================
    else if (type === "ciAnnually") {
        let years = Math.floor(totalMonths / 12);
        let rem = totalMonths % 12;
        let stepAmount = p;
        explanation = `<h4>Calculation (CI Annually)</h4>`;

        for (let i = 1; i <= years; i++) {
            let interest = stepAmount * (rMonth / 100) * 12;
            interest = parseFloat(interest.toFixed(6));
            explanation += `Year ${i}: ${stepAmount.toFixed(6)} × ${rMonth / 100} × 12 = ${interest.toFixed(6)}<br>`;
            stepAmount = parseFloat((stepAmount + interest).toFixed(6));
        }

        if (rem > 0) {
            let interest = stepAmount * (rMonth / 100) * rem;
            interest = parseFloat(interest.toFixed(6));
            let remMonths = Math.floor(rem);
            explanation += `Remaining: ${stepAmount.toFixed(6)} × ${rMonth / 100} × (${remMonths}+(${d.toFixed(2)}/30)) = ${interest.toFixed(6)}<br>`;
            stepAmount = parseFloat((stepAmount + interest).toFixed(6));
        }
        amount = stepAmount;
    }

    // ======================
    // CI HALF-YEARLY
    // ======================
    else if (type === "ciHalfYearly") {
        let half = Math.floor(totalMonths / 6);
        let rem = totalMonths % 6;
        let stepAmount = p;
        explanation = `<h4>Calculation (CI Half-Yearly)</h4>`;

        for (let i = 1; i <= half; i++) {
            let interest = stepAmount * (rMonth / 100) * 6;
            interest = parseFloat(interest.toFixed(6));
            explanation += `Half-Year ${i}: ${stepAmount.toFixed(6)} × ${rMonth / 100} × 6 = ${interest.toFixed(6)}<br>`;
            stepAmount = parseFloat((stepAmount + interest).toFixed(6));
        }

        if (rem > 0) {
            let interest = stepAmount * (rMonth / 100) * rem;
            interest = parseFloat(interest.toFixed(6));
            let remMonths = Math.floor(rem);
            explanation += `Remaining: ${stepAmount.toFixed(6)} × ${rMonth / 100} × (${remMonths}+(${d.toFixed(2)}/30)) = ${interest.toFixed(6)}<br>`;
            stepAmount = parseFloat((stepAmount + interest).toFixed(6));
        }
        amount = stepAmount;
    }

    let interestFinal = parseFloat((amount - p).toFixed(6));

    // Display results
    document.getElementById("displayArea").style.display = "block";
    document.getElementById("resDuration").innerText =
        `${formatNiceDate(start)}\n${y} years ${m} months ${d} days\n(${Math.floor(totalMonths)} (${d}/30) months)`;
    
    // Final output rounded to one decimal place
    document.getElementById("resInterest").innerText = "₹ " + interestFinal.toFixed(1);
    document.getElementById("resTotal").innerText = "₹ " + amount.toFixed(1);
    
    document.getElementById("explanation").innerHTML = explanation;
}
