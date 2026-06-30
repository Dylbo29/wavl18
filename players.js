const players = [ 
        // =========================
    // SETTERS
    // =========================

    {
        id: 1,
        name: "Ryan Slater",
        club: "Reds",
        position: "S",
        overall: 99,
        attack: 84,
        defence: 93,
        potential: 99
    },

    {
        id: 2,
        name: "Mitch Lewington",
        club: "Balcatta",
        position: "S",
        overall: 98,
        attack: 83,
        defence: 92,
        potential: 97
    },

    {
        id: 3,
        name: "Alex Majri",
        club: "Chequers",
        position: "S",
        overall: 97,
        attack: 82,
        defence: 91,
        potential: 96
    },

    {
        id: 4,
        name: "Alvin Goh",
        club: "Chequers",
        position: "S",
        overall: 96,
        attack: 82,
        defence: 90,
        potential: 95
    },

    {
        id: 5,
        name: "Kable Monck",
        club: "Rossmoyne",
        position: "S",
        overall: 94,
        attack: 80,
        defence: 89,
        potential: 93
    },

    {
        id: 6,
        name: "Zach Santamaria",
        club: "Southern Cross",
        position: "S",
        overall: 93,
        attack: 79,
        defence: 88,
        potential: 92
    },

    {
        id: 7,
        name: "Ben Fourie",
        club: "Northern Stars",
        position: "S",
        overall: 92,
        attack: 79,
        defence: 87,
        potential: 91
    },

    {
        id: 8,
        name: "Sean Kennedy",
        club: "Southern Cross",
        position: "S",
        overall: 91,
        attack: 78,
        defence: 87,
        potential: 90
    },

    {
        id: 9,
        name: "Kaleb Boyle",
        club: "Rossmoyne",
        position: "S",
        overall: 90,
        attack: 78,
        defence: 86,
        potential: 89
    },

    {
        id: 10,
        name: "Kaan Ozdemir",
        club: "Reds",
        position: "S",
        overall: 87,
        attack: 75,
        defence: 83,
        potential: 86
    },

    {
        id: 11,
        name: "Declan Munt",
        club: "Balcatta",
        position: "S",
        overall: 86,
        attack: 74,
        defence: 82,
        potential: 85
    },

    {
        id: 12,
        name: "Kieran Manason",
        club: "Balcatta",
        position: "S",
        overall: 85,
        attack: 74,
        defence: 81,
        potential: 84
    },

    {
        id: 13,
        name: "Samuel Ho",
        club: "Reds",
        position: "S",
        overall: 84,
        attack: 73,
        defence: 81,
        potential: 83
    },

    {
        id: 14,
        name: "Jonathan Hague",
        club: "Northern Stars",
        position: "S",
        overall: 83,
        attack: 73,
        defence: 80,
        potential: 82
    },

    {
        id: 15,
        name: "Dylan Fissioli",
        club: "Northern Stars",
        position: "S",
        overall: 80,
        attack: 70,
        defence: 77,
        potential: 79
    },

    {
        id: 16,
        name: "Ho Fung Chong",
        club: "Apex",
        position: "S",
        overall: 79,
        attack: 70,
        defence: 76,
        potential: 78
    },

    {
        id: 17,
        name: "Matthew Costa",
        club: "Apex",
        position: "S",
        overall: 78,
        attack: 69,
        defence: 75,
        potential: 77
    },

    {
        id: 90,
        name: "Thomas Park",
        club: "Northern Stars",
        position: "S",
        overall: 90,
        attack: 74,
        defence: 86,
        potential: 90
    },

    {
        id: 94,
        name: "Tristan Watts",
        club: "Chequers",
        position: "S",
        overall: 80,
        attack: 80,
        defence: 72,
        potential: 80
    },     // =========================
    // PIN HITTERS
    // =========================

    {
        id: 18,
        name: "Dylan Wood",
        club: "Chequers",
        position: "PH",
        overall: 99,
        attack: 99,
        defence: 92,
        potential: 97
    },

    {
        id: 19,
        name: "Matthew Pallot",
        club: "Southern Cross",
        position: "PH",
        overall: 98,
        attack: 98,
        defence: 91,
        potential: 96
    },

    {
        id: 20,
        name: "Ky Landers",
        club: "Chequers",
        position: "PH",
        overall: 97,
        attack: 97,
        defence: 90,
        potential: 95
    },

    {
        id: 21,
        name: "Joseph Paul",
        club: "Rossmoyne",
        position: "PH",
        overall: 96,
        attack: 96,
        defence: 89,
        potential: 94
    },

    {
        id: 22,
        name: "Daniel Piggott",
        club: "Southern Cross",
        position: "PH",
        overall: 94,
        attack: 94,
        defence: 87,
        potential: 92
    },

    {
        id: 23,
        name: "Ryan Smith",
        club: "Rossmoyne",
        position: "PH",
        overall: 93,
        attack: 93,
        defence: 87,
        potential: 91
    },

    {
        id: 24,
        name: "Nikita Marchenkov",
        club: "Balcatta",
        position: "PH",
        overall: 92,
        attack: 92,
        defence: 86,
        potential: 90
    },

    {
        id: 25,
        name: "Simon Durack",
        club: "Balcatta",
        position: "PH",
        overall: 91,
        attack: 91,
        defence: 86,
        potential: 89
    },

    {
        id: 26,
        name: "Matt Reaves",
        club: "Northern Stars",
        position: "PH",
        overall: 90,
        attack: 90,
        defence: 85,
        potential: 88
    },

    {
        id: 27,
        name: "Harrison Buhler",
        club: "Southern Cross",
        position: "PH",
        overall: 87,
        attack: 87,
        defence: 83,
        potential: 85
    },

    {
        id: 28,
        name: "Alex Neindorf",
        club: "Chequers",
        position: "PH",
        overall: 86,
        attack: 86,
        defence: 82,
        potential: 84
    },

    {
        id: 29,
        name: "Dylan Bauer",
        club: "Rossmoyne",
        position: "PH",
        overall: 85,
        attack: 85,
        defence: 81,
        potential: 83
    },

    {
        id: 30,
        name: "Jonathan Hunt",
        club: "Balcatta",
        position: "PH",
        overall: 84,
        attack: 84,
        defence: 81,
        potential: 82
    },

    // Unranked Pin Hitters

    { id:31, name:"Angus Flower", club:"Reds", position:"PH", overall:77, attack:77, defence:75, potential:77 },
    { id:32, name:"Ben Abbott", club:"Reds", position:"PH", overall:77, attack:77, defence:75, potential:77 },
    { id:33, name:"Chi Kin Wong", club:"Apex", position:"PH", overall:76, attack:76, defence:74, potential:76 },
    { id:34, name:"Henry Zhang", club:"Apex", position:"PH", overall:76, attack:76, defence:74, potential:76 },
    { id:35, name:"Jack London", club:"Reds", position:"PH", overall:76, attack:76, defence:74, potential:76 },
    { id:36, name:"Kye McLaren", club:"Balcatta", position:"PH", overall:72, attack:72, defence:70, potential:72 },
    { id:37, name:"Liam Ryan", club:"Northern Stars", position:"PH", overall:72, attack:72, defence:70, potential:72 },
    { id:38, name:"Rhylee Hand", club:"Apex", position:"PH", overall:72, attack:72, defence:70, potential:72 },
    { id:39, name:"Thomas Durand", club:"Apex", position:"PH", overall:71, attack:71, defence:69, potential:71 },
    { id:40, name:"Cale Lance", club:"Chequers", position:"PH", overall:71, attack:71, defence:69, potential:71 },
    { id:41, name:"Rielly Vincent", club:"Reds", position:"PH", overall:71, attack:71, defence:69, potential:71 },
    { id:42, name:"Ehizele Ogwu", club:"Reds", position:"PH", overall:71, attack:71, defence:69, potential:71 },     // =========================
    { id:91, name:"Kable Monck", club:"Rossmoyne", position:"PH", overall:75, attack:75, defence:68, potential:75 },
    { id:92, name:"Thomas Park", club:"Northern Stars", position:"PH", overall:60, attack:60, defence:54, potential:60 },     // =========================
    // MIDDLE BLOCKERS
    // =========================

    {
        id:43,
        name:"Jose Manuel Martinez Rebollar",
        club:"Chequers",
        position:"MB",
        overall:99,
        attack:96,
        defence:99,
        potential:97
    },

    {
        id:44,
        name:"Caleb Watson",
        club:"Balcatta",
        position:"MB",
        overall:98,
        attack:95,
        defence:98,
        potential:96
    },

    {
        id:45,
        name:"Jonty Chapman",
        club:"Reds",
        position:"MB",
        overall:97,
        attack:94,
        defence:97,
        potential:95
    },

    {
        id:46,
        name:"Jordan Fancote",
        club:"Reds",
        position:"MB",
        overall:96,
        attack:93,
        defence:96,
        potential:94
    },

    {
        id:47,
        name:"Henry Marsh",
        club:"Southern Cross",
        position:"MB",
        overall:94,
        attack:91,
        defence:94,
        potential:92
    },

    {
        id:48,
        name:"Jacob Allison",
        club:"Southern Cross",
        position:"MB",
        overall:93,
        attack:90,
        defence:93,
        potential:91
    },

    {
        id:49,
        name:"Jake Harburn",
        club:"Rossmoyne",
        position:"MB",
        overall:92,
        attack:89,
        defence:92,
        potential:90
    },

    {
        id:50,
        name:"Declan Walsh",
        club:"Southern Cross",
        position:"MB",
        overall:91,
        attack:88,
        defence:91,
        potential:89
    },

    {
        id:51,
        name:"Kieran Mullee",
        club:"Northern Stars",
        position:"MB",
        overall:90,
        attack:87,
        defence:90,
        potential:88
    },

    {
        id:52,
        name:"John Mark Joshua Castillo",
        club:"Apex",
        position:"MB",
        overall:87,
        attack:84,
        defence:87,
        potential:85
    },

    {
        id:53,
        name:"Joshua Monnaie",
        club:"Rossmoyne",
        position:"MB",
        overall:86,
        attack:83,
        defence:86,
        potential:84
    },

    {
        id:54,
        name:"Edan Cristinelli",
        club:"Northern Stars",
        position:"MB",
        overall:85,
        attack:82,
        defence:85,
        potential:83
    },

    {
        id:55,
        name:"Benjamin Ramsay",
        club:"Balcatta",
        position:"MB",
        overall:84,
        attack:81,
        defence:84,
        potential:82
    },

    {
        id:56,
        name:"Ethan Harriduth",
        club:"Chequers",
        position:"MB",
        overall:83,
        attack:80,
        defence:83,
        potential:81
    },

    {
        id:57,
        name:"Made Chidgey",
        club:"Chequers",
        position:"MB",
        overall:80,
        attack:77,
        defence:80,
        potential:78
    },

    {
        id:58,
        name:"Callum Nicol",
        club:"Northern Stars",
        position:"MB",
        overall:79,
        attack:76,
        defence:79,
        potential:77
    },

    {
        id:59,
        name:"Andrew Belcher",
        club:"Apex",
        position:"MB",
        overall:78,
        attack:75,
        defence:78,
        potential:76
    },

    {
        id:60,
        name:"Heinrich Haan",
        club:"Northern Stars",
        position:"MB",
        overall:77,
        attack:74,
        defence:77,
        potential:75
    },

    {
        id:61,
        name:"Saurav Bisnoi",
        club:"Apex",
        position:"MB",
        overall:76,
        attack:73,
        defence:76,
        potential:74
    },

    {
        id:62,
        name:"Lachlan Holmes",
        club:"Chequers",
        position:"MB",
        overall:72,
        attack:69,
        defence:72,
        potential:70
    },

    {
        id:63,
        name:"Spencer Teo",
        club:"Rossmoyne",
        position:"MB",
        overall:71,
        attack:68,
        defence:71,
        potential:69
    },

    {
        id:64,
        name:"Marcus Lin",
        club:"Southern Cross",
        position:"MB",
        overall:70,
        attack:67,
        defence:70,
        potential:68
    },

    {
        id:65,
        name:"Jaxon Neill",
        club:"Reds",
        position:"MB",
        overall:69,
        attack:66,
        defence:69,
        potential:67
    },

    {
        id:66,
        name:"Harry Hornby",
        club:"Rossmoyne",
        position:"MB",
        overall:68,
        attack:65,
        defence:68,
        potential:66
    },

    {
        id:67,
        name:"Baxter Notting",
        club:"Northern Stars",
        position:"MB",
        overall:67,
        attack:64,
        defence:67,
        potential:65
    },     // =========================
    // OPPOSITES
    // =========================

    {
        id:68,
        name:"Tristan Watts",
        club:"Chequers",
        position:"OPP",
        overall:99,
        attack:99,
        defence:82,
        potential:97
    },

    {
        id:69,
        name:"Ryan Carter",
        club:"Southern Cross",
        position:"OPP",
        overall:98,
        attack:98,
        defence:81,
        potential:96
    },

    {
        id:70,
        name:"Harry Gibson",
        club:"Southern Cross",
        position:"OPP",
        overall:97,
        attack:97,
        defence:80,
        potential:95
    },

    {
        id:71,
        name:"Xavier Ulgiati Ferreria",
        club:"Reds",
        position:"OPP",
        overall:96,
        attack:96,
        defence:80,
        potential:94
    },

    {
        id:72,
        name:"Andrew Clayton",
        club:"Balcatta",
        position:"OPP",
        overall:94,
        attack:94,
        defence:78,
        potential:92
    },

    {
        id:73,
        name:"Casey Gonzales",
        club:"Apex",
        position:"OPP",
        overall:93,
        attack:93,
        defence:77,
        potential:91
    },

    {
        id:74,
        name:"Bryce Poland",
        club:"Chequers",
        position:"OPP",
        overall:92,
        attack:92,
        defence:76,
        potential:90
    },

    {
        id:75,
        name:"Gurmanpreet Singh",
        club:"Chequers",
        position:"OPP",
        overall:91,
        attack:91,
        defence:76,
        potential:89
    },

    {
        id:76,
        name:"Lucas Priest",
        club:"Rossmoyne",
        position:"OPP",
        overall:90,
        attack:90,
        defence:75,
        potential:88
    },

    {
        id:77,
        name:"Jakob Hawkes",
        club:"Reds",
        position:"OPP",
        overall:79,
        attack:79,
        defence:67,
        potential:79
    },

    {
        id:78,
        name:"Oscar Knight",
        club:"Reds",
        position:"OPP",
        overall:78,
        attack:78,
        defence:66,
        potential:78
    },

    {
        id:79,
        name:"Dustin Kendall",
        club:"Northern Stars",
        position:"OPP",
        overall:77,
        attack:77,
        defence:65,
        potential:77
    },

    {
        id:80,
        name:"Callum Huppatz",
        club:"Balcatta",
        position:"OPP",
        overall:76,
        attack:76,
        defence:64,
        potential:76
    },

    {
        id:93,
        name:"Jose Manuel Martinez Rebollar",
        club:"Chequers",
        position:"OPP",
        overall:80,
        attack:82,
        defence:74,
        potential:80
    },     // =========================
    // LIBEROS
    // =========================

    {
        id:81,
        name:"Lewis McDonald",
        club:"Southern Cross",
        position:"L",
        overall:99,
        attack:72,
        defence:99,
        potential:97
    },

    {
        id:82,
        name:"Thomas Park",
        club:"Northern Stars",
        position:"L",
        overall:98,
        attack:71,
        defence:98,
        potential:96
    },

    {
        id:83,
        name:"Oswald Tan",
        club:"Chequers",
        position:"L",
        overall:97,
        attack:70,
        defence:97,
        potential:95
    },

    {
        id:84,
        name:"Daniel Fitzgerald",
        club:"Chequers",
        position:"L",
        overall:96,
        attack:70,
        defence:96,
        potential:94
    },

    {
        id:85,
        name:"Maksim Bacovic",
        club:"Balcatta",
        position:"L",
        overall:94,
        attack:68,
        defence:94,
        potential:92
    },

    {
        id:86,
        name:"Matthew Waddington",
        club:"Rossmoyne",
        position:"L",
        overall:93,
        attack:67,
        defence:93,
        potential:91
    },

    {
        id:87,
        name:"Samuel Hoskin",
        club:"Rossmoyne",
        position:"L",
        overall:92,
        attack:67,
        defence:92,
        potential:90
    },

    {
        id:88,
        name:"Meli Naborisi",
        club:"Apex",
        position:"L",
        overall:91,
        attack:66,
        defence:91,
        potential:89
    },

    {
        id:89,
        name:"Hudson Spooner",
        club:"Northern Stars",
        position:"L",
        overall:90,
        attack:66,
        defence:90,
        potential:88
    }

];