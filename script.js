/* =====================================================
   EMPIRE//X
   CORPORATE EMPIRE GAME
===================================================== */

let game = {
    day: 1,
    hour: 8,

    money: 1000000,

    reputation: 50,

    level: 1,
    xp: 0,

    employees: [],

    holding: 0,

    businesses: {
        tech: 0,
        factory: 0,
        hotel: 0,
        energy: 0,
        logistics: 0
    },

    businessLevel: {
        tech: 1,
        factory: 1,
        hotel: 1,
        energy: 1,
        logistics: 1
    },

    stocks: {
        TECH: 500,
        AUTO: 800,
        ENERGY: 350,
        FOOD: 220,
        LOGISTICS: 600
    },

    missions: {
        business: false,
        employee: false,
        investment: false,
        profit: false
    },

    player: {
        x: 45,
        y: 22
    }
};


/* =====================================================
   BUSINESS DATABASE
===================================================== */

const businesses = {

    tech: {
        name: "NEXUS TECHNOLOGY",
        icon: "◈",
        price: 250000,
        income: 35000,
        description: "High-tech software and AI company."
    },

    factory: {
        name: "TITAN INDUSTRIES",
        icon: "▣",
        price: 400000,
        income: 55000,
        description: "Advanced manufacturing facility."
    },

    hotel: {
        name: "ORBITAL HOTELS",
        icon: "◇",
        price: 300000,
        income: 40000,
        description: "Luxury futuristic hotel chain."
    },

    energy: {
        name: "NOVA ENERGY",
        icon: "⚡",
        price: 500000,
        income: 75000,
        description: "Next-generation energy company."
    },

    logistics: {
        name: "VECTOR LOGISTICS",
        icon: "⬡",
        price: 350000,
        income: 48000,
        description: "Global logistics network."
    }

};


/* =====================================================
   EVENTS
===================================================== */

const events = [

    {
        title: "TECH BOOM",
        text: "Demand for technology has increased.",
        effect: 1.20
    },

    {
        title: "SUPPLY CRISIS",
        text: "Manufacturing costs have increased.",
        effect: 0.85
    },

    {
        title: "ENERGY DISCOVERY",
        text: "A new energy breakthrough boosts the economy.",
        effect: 1.25
    },

    {
        title: "MARKET PANIC",
        text: "Investors become nervous. Markets fall.",
        effect: 0.80
    },

    {
        title: "CONSUMER BOOM",
        text: "Consumer spending rises across the city.",
        effect: 1.15
    },

    {
        title: "COMPETITOR WAR",
        text: "A rival corporation launches aggressive pricing.",
        effect: 0.90
    },

    {
        title: "GOVERNMENT CONTRACT",
        text: "Large contracts increase business opportunities.",
        effect: 1.30
    }

];


/* =====================================================
   DOM
===================================================== */

const moneyEl = document.getElementById("money");
const incomeEl = document.getElementById("income");
const companyValueEl = document.getElementById("companyValue");
const reputationEl = document.getElementById("reputation");
const employeeCountEl = document.getElementById("employeeCount");
const employeeBigEl = document.getElementById("employeeBig");
const levelEl = document.getElementById("level");
const xpBarEl = document.getElementById("xpBar");
const clockEl = document.getElementById("clock");
const marketStatusEl = document.getElementById("marketStatus");
const holdingEl = document.getElementById("holding");


/* =====================================================
   FORMAT MONEY
===================================================== */

function money(value) {

    return "₹" + Math.floor(value).toLocaleString("en-IN");

}


/* =====================================================
   SAVE
===================================================== */

function saveGame() {

    localStorage.setItem(
        "EMPIRE_X_SAVE",
        JSON.stringify(game)
    );

    toast("GAME SAVED");

}


/* =====================================================
   LOAD
===================================================== */

function loadGame() {

    const saved = localStorage.getItem("EMPIRE_X_SAVE");

    if (!saved) return;

    try {

        const data = JSON.parse(saved);

        game = {
            ...game,
            ...data
        };

        toast("SAVE LOADED");

    } catch {

        console.log("Save error");

    }

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer;

function toast(message) {

    const el = document.getElementById("toast");

    el.textContent = message;

    el.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        el.classList.remove("show");

    }, 2500);

}


/* =====================================================
   CALCULATE INCOME
===================================================== */

function calculateIncome() {

    let income = 0;

    Object.keys(game.businesses).forEach(key => {

        const amount = game.businesses[key];

        const business = businesses[key];

        const level = game.businessLevel[key];

        income +=
            amount *
            business.income *
            (1 + (level - 1) * 0.25);

    });

    income += game.employees.length * 2500;

    income *= game.reputation / 50;

    return Math.floor(income);

}


/* =====================================================
   COMPANY VALUE
===================================================== */

function companyValue() {

    let value = game.money;

    Object.keys(game.businesses).forEach(key => {

        value +=
            game.businesses[key] *
            businesses[key].price;

    });

    value += game.employees.length * 15000;

    value += game.holding *
        averageStockPrice();

    return value;

}


/* =====================================================
   BUY BUSINESS
===================================================== */

function buyBusiness(key) {

    const b = businesses[key];

    if (game.money < b.price) {

        toast("NOT ENOUGH CAPITAL");

        return;

    }

    game.money -= b.price;

    game.businesses[key]++;

    game.reputation += 2;

    addXP(80);

    toast(
        `${b.name} ACQUIRED`
    );

    if (
        game.businesses[key] >= 1 &&
        !game.missions.business
    ) {

        game.missions.business = true;

        reward(100);

    }

    render();

}


/* =====================================================
   UPGRADE BUSINESS
===================================================== */

function upgradeBusiness(key) {

    const level =
        game.businessLevel[key];

    const cost =
        businesses[key].price *
        level *
        0.35;

    if (game.money < cost) {

        toast("INSUFFICIENT CAPITAL");

        return;

    }

    game.money -= cost;

    game.businessLevel[key]++;

    addXP(50);

    toast(
        `${businesses[key].name} UPGRADED`
    );

    render();

}


/* =====================================================
   EMPLOYEE
===================================================== */

function hireEmployee() {

    const cost = 25000;

    if (game.money < cost) {

        toast("INSUFFICIENT CAPITAL");

        return;

    }

    game.money -= cost;

    const names = [
        "ALEX",
        "MAYA",
        "RYAN",
        "ARIA",
        "NOAH",
        "LEO",
        "ZARA",
        "KAI",
        "NOVA",
        "ADAM"
    ];

    const name =
        names[
            Math.floor(
                Math.random() *
                names.length
            )
        ];

    const employee = {

        name,

        skill:
            Math.floor(
                Math.random() * 50
            ) + 50,

        productivity:
            Math.floor(
                Math.random() * 40
            ) + 60

    };

    game.employees.push(employee);

    addXP(40);

    game.reputation++;

    if (
        game.employees.length >= 5 &&
        !game.missions.employee
    ) {

        game.missions.employee = true;

        reward(150);

    }

    toast(
        `${name} JOINED YOUR COMPANY`
    );

    render();

}


/* =====================================================
   XP SYSTEM
===================================================== */

function addXP(amount) {

    game.xp += amount;

    const required =
        game.level * 500;

    if (game.xp >= required) {

        game.xp -= required;

        game.level++;

        game.reputation += 3;

        toast(
            `LEVEL UP! YOU ARE NOW LEVEL ${game.level}`
        );

    }

}


/* =====================================================
   REWARD
===================================================== */

function reward(xp) {

    addXP(xp);

    toast(
        `MISSION COMPLETE +${xp} XP`
    );

}


/* =====================================================
   STOCK MARKET
===================================================== */

function averageStockPrice() {

    const values =
        Object.values(game.stocks);

    return values.reduce(
        (a,b) => a+b,
        0
    ) / values.length;

}


function buyStock() {

    const price =
        game.stocks.TECH;

    if (game.money < price) {

        toast("NOT ENOUGH CASH");

        return;

    }

    game.money -= price;

    game.holding++;

    addXP(25);

    if (
        game.holding >= 5 &&
        !game.missions.investment
    ) {

        game.missions.investment = true;

        reward(100);

    }

    toast("TECH SHARES PURCHASED");

    render();

}


function sellStock() {

    if (game.holding <= 0) {

        toast("NO SHARES TO SELL");

        return;

    }

    const price =
        game.stocks.TECH;

    game.money += price;

    game.holding--;

    toast("SHARES SOLD");

    render();

}


/* =====================================================
   MARKET UPDATE
===================================================== */

function updateMarket() {

    Object.keys(game.stocks)
        .forEach(key => {

            const change =
                (Math.random() * 0.16) - 0.08;

            game.stocks[key] =
                Math.max(
                    50,
                    game.stocks[key] *
                    (1 + change)
                );

        });

    const market =
        document.getElementById(
            "marketStatus"
        );

    const roll =
        Math.random();

    if (roll > .65) {

        market.textContent =
            "MARKET: BULLISH";

    } else if (roll < .35) {

        market.textContent =
            "MARKET: VOLATILE";

    } else {

        market.textContent =
            "MARKET: STABLE";

    }

}


/* =====================================================
   DAILY EVENT
===================================================== */

function randomEvent() {

    const event =
        events[
            Math.floor(
                Math.random() *
                events.length
            )
        ];

    document.getElementById(
        "eventTitle"
    ).textContent = event.title;

    document.getElementById(
        "eventText"
    ).textContent = event.text;

    game.money *= event.effect;

    if (event.effect > 1) {

        game.reputation =
            Math.min(
                100,
                game.reputation + 2
            );

    } else {

        game.reputation =
            Math.max(
                0,
                game.reputation - 2
            );

    }

}


/* =====================================================
   ADVANCE DAY
===================================================== */

function advanceDay() {

    const income =
        calculateIncome();

    game.money += income;

    game.day++;

    game.hour = 8;

    updateMarket();

    randomEvent();

    addXP(100);

    if (
        income > 100000 &&
        !game.missions.profit
    ) {

        game.missions.profit = true;

        reward(250);

    }

    toast(
        `DAY ${game.day} • +${money(income)}`
    );

    render();

}


/* =====================================================
   COLLECT PROFIT
===================================================== */

function collectProfit() {

    const income =
        calculateIncome();

    game.money += income;

    addXP(50);

    toast(
        `PROFIT COLLECTED ${money(income)}`
    );

    render();

}


/* =====================================================
   MISSION UI
===================================================== */

function renderMissions() {

    const list =
        document.getElementById(
            "missionList"
        );

    const missions = [

        {
            title: "FIRST ACQUISITION",
            text: "Buy your first business.",
            reward: "100 XP",
            done: game.missions.business
        },

        {
            title: "BUILD A TEAM",
            text: "Hire 5 employees.",
            reward: "150 XP",
            done: game.missions.employee
        },

        {
            title: "MARKET PLAYER",
            text: "Own 5 fictional shares.",
            reward: "100 XP",
            done: game.missions.investment
        },

        {
            title: "PROFIT MACHINE",
            text: "Generate ₹1,00,000 daily income.",
            reward: "250 XP",
            done: game.missions.profit
        }

    ];

    list.innerHTML = "";

    missions.forEach(m => {

        const div =
            document.createElement("div");

        div.className =
            "mission-card " +
            (m.done ? "complete" : "");

        div.innerHTML = `

            <h3>
                ${m.done ? "✓ " : ""}
                ${m.title}
            </h3>

            <p>${m.text}</p>

            <span class="reward">
                REWARD: ${m.reward}
            </span>

        `;

        list.appendChild(div);

    });

}


/* =====================================================
   BUSINESS UI
===================================================== */

function renderBusinesses() {

    const list =
        document.getElementById(
            "businessList"
        );

    list.innerHTML = "";

    Object.keys(businesses)
        .forEach(key => {

            const b =
                businesses[key];

            const owned =
                game.businesses[key];

            const level =
                game.businessLevel[key];

            const upgradeCost =
                b.price *
                level *
                0.35;

            const div =
                document.createElement("div");

            div.className =
                "business-card";

            div.innerHTML = `

                <div>

                    <h3>
                        ${b.icon}
                        ${b.name}
                    </h3>

                    <p>
                        ${b.description}
                    </p>

                    <p>
                        OWNED: ${owned}
                        • LEVEL: ${level}
                    </p>

                    <p>
                        INCOME:
                        ${money(
                            b.income *
                            (1 + (level-1)*.25)
                        )}
                    </p>

                </div>

                <div>

                    <button
                        onclick="buyBusiness('${key}')"
                    >
                        BUY<br>
                        ${money(b.price)}
                    </button>

                    ${
                        owned > 0
                        ?
                        `<button
                            onclick="upgradeBusiness('${key}')"
                            style="margin-top:6px"
                        >
                            UPGRADE
                            <br>
                            ${money(upgradeCost)}
                        </button>`
                        :
                        ""
                    }

                </div>
            `;

            list.appendChild(div);

        });

}


/* =====================================================
   MARKET UI
===================================================== */

function renderMarket() {

    const list =
        document.getElementById(
            "marketList"
        );

    list.innerHTML = "";

    Object.keys(game.stocks)
        .forEach(key => {

            const price =
                game.stocks[key];

            const div =
                document.createElement("div");

            div.className =
                "market-card";

            div.innerHTML = `

                <div>

                    <b>${key}</b>

                    <span>
                        FICTIONAL MARKET
                    </span>

                </div>

                <div class="market-price">
                    ${money(price)}
                </div>

            `;

            list.appendChild(div);

        });

}


/* =====================================================
   EMPLOYEE UI
===================================================== */

function renderEmployees() {

    const list =
        document.getElementById(
            "employeeList"
        );

    list.innerHTML = "";

    game.employees.forEach(
        (employee,index) => {

            const div =
                document.createElement("div");

            div.className =
                "employee-card";

            div.innerHTML = `

                <div>

                    <b>${employee.name}</b>

                    <small>
                        EXECUTIVE EMPLOYEE #${index+1}
                    </small>

                </div>

                <div>

                    <b>
                        ${employee.skill}
                    </b>

                    <small>
                        SKILL
                    </small>

                </div>

                <div>

                    <b>
                        ${employee.productivity}%
                    </b>

                    <small>
                        PRODUCTIVITY
                    </small>

                </div>

            `;

            list.appendChild(div);

        }
    );

}


/* =====================================================
   MAIN RENDER
===================================================== */

function render() {

    moneyEl.textContent =
        money(game.money);

    const income =
        calculateIncome();

    incomeEl.textContent =
        "+" + money(income) + " / day";

    companyValueEl.textContent =
        money(companyValue());

    reputationEl.textContent =
        Math.floor(game.reputation) + "%";

    employeeCountEl.textContent =
        game.employees.length;

    employeeBigEl.textContent =
        game.employees.length;

    levelEl.textContent =
        game.level;

    const required =
        game.level * 500;

    xpBarEl.style.width =
        Math.min(
            100,
            (game.xp / required) * 100
        ) + "%";

    clockEl.textContent =
        `DAY ${game.day} • ${String(game.hour).padStart(2,"0")}:00`;

    holdingEl.textContent =
        game.holding;

    renderBusinesses();

    renderMarket();

    renderEmployees();

    renderMissions();

    updatePlayer();

}


/* =====================================================
   PLAYER MOVEMENT
===================================================== */

function updatePlayer() {

    const player =
        document.getElementById(
            "player"
        );

    player.style.left =
        game.player.x + "%";

    player.style.bottom =
        game.player.y + "%";

}


function movePlayer(key) {

    const speed = 1.5;

    if (key === "w") {
        game.player.y =
            Math.min(
                45,
                game.player.y + speed
            );
    }

    if (key === "s") {
        game.player.y =
            Math.max(
                8,
                game.player.y - speed
            );
    }

    if (key === "a") {
        game.player.x =
            Math.max(
                5,
                game.player.x - speed
            );
    }

    if (key === "d") {
        game.player.x =
            Math.min(
                90,
                game.player.x + speed
            );
    }

    updatePlayer();

}


/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener(
    "keydown",
    e => {

        const key =
            e.key.toLowerCase();

        if (
            ["w","a","s","d"]
            .includes(key)
        ) {

            movePlayer(key);

        }

    }
);


/* =====================================================
   MOBILE CONTROLS
===================================================== */

document.querySelectorAll(
    ".movement button"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            movePlayer(
                button.dataset.key
            );

        }
    );

});


/* =====================================================
   NAVIGATION
===================================================== */

document.querySelectorAll(
    ".nav"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(".nav")
                .forEach(x =>
                    x.classList.remove(
                        "active"
                    )
                );

            document
                .querySelectorAll(".page")
                .forEach(x =>
                    x.classList.remove(
                        "active"
                    )
                );

            button.classList.add(
                "active"
            );

            document
                .getElementById(
                    button.dataset.page
                )
                .classList.add(
                    "active"
                );

        }
    );

});


/* =====================================================
   BUTTONS
===================================================== */

document.getElementById(
    "hireBtn"
).onclick = hireEmployee;

document.getElementById(
    "collectBtn"
).onclick = collectProfit;

document.getElementById(
    "restBtn"
).onclick = advanceDay;

document.getElementById(
    "buyStock"
).onclick = buyStock;

document.getElementById(
    "sellStock"
).onclick = sellStock;

document.getElementById(
    "saveBtn"
).onclick = saveGame;

document.getElementById(
    "interactBtn"
).onclick = () => {

    toast(
        "CEO TERMINAL ACTIVATED"
    );

};


/* =====================================================
   AUTO GAME CLOCK
===================================================== */

setInterval(() => {

    game.hour++;

    if (game.hour >= 24) {

        game.hour = 8;

        game.day++;

        game.money +=
            calculateIncome();

        updateMarket();

        randomEvent();

        addXP(50);

    }

    render();

}, 10000);


/* =====================================================
   INITIALIZE
===================================================== */

loadGame();

render();


setTimeout(() => {

    document.getElementById(
        "loading"
    ).style.display = "none";

}, 1500);
