// Every word and number on the page. Layout code holds none.
// Badges: C = CONFIRMED (2+ outlets), O = OFFICIAL (on the record), R = REPORTED (one outlet), CL = CLAIM (one side).

export const day = {
  weekday: 'Monday',
  date: '23 November 2026',
  kicker: "ONE PAGE FOR MONDAY'S WORLD",
  order: 'RANKED BY CONSEQUENCE',
  listHead: 'ALSO ON MONDAY 23 NOVEMBER',
};

export const regions = {
  ME: { name: 'Middle East', color: '#B34700' },
  AF: { name: 'Africa', color: '#00704F' },
  EU: { name: 'Europe', color: '#0B5AA0' },
  SA: { name: 'South Asia', color: '#A3238A' },
  EA: { name: 'East Asia', color: '#7A6400' },
  SE: { name: 'SE Asia', color: '#5A45A8' },
  NA: { name: 'N. America', color: '#2E2E2E' },
  LA: { name: 'Latin America', color: '#00809A' },
  OC: { name: 'Oceania', color: '#8C2F39' },
};

export const badges = {
  C: { word: 'CONFIRMED', short: 'C', color: '#1E6B3A' },
  O: { word: 'OFFICIAL', short: 'O', color: '#1F4E8C' },
  R: { word: 'REPORTED', short: 'R', color: '#5C5C5C' },
  CL: { word: 'CLAIM', short: 'CL', color: '#B3122B' },
};

// Ranked by consequence: deaths and scale, then politics and economy, then culture.
export const stories = [
  { id: 'hormuz', place: 'Strait of Hormuz', region: 'ME', field: 'SECURITY', badge: 'C', src: 'UKMTO, Al Jazeera, CNN', art: 'hormuz', label: '3 SHIPS HIT',
    head: 'Three more ships struck in the Strait of Hormuz',
    sum: 'UKMTO logged 3 vessels hit on Monday evening; CNN says attacks are at their fastest pace since February.' },
  { id: 'libya', place: 'Eastern Libya', region: 'AF', field: 'CONFLICT', badge: 'CL', src: 'Zelensky; Kremlin', art: 'libya', label: 'KYIV: SUNK',
    head: 'Ukraine says it sank a Russian warship',
    sum: 'Zelensky claims the hit at a Libyan naval base, where a blast and fire were seen; Kremlin: "terrorist activity".' },
  { id: 'gaza', place: 'Gaza', region: 'ME', field: 'CONFLICT', badge: 'C', src: 'UNRWA, Al Jazeera', art: 'gaza', label: 'AT LEAST 3 KILLED',
    head: 'Israeli strikes kill at least 3, one a UN worker',
    sum: 'UNRWA says one of its staff was killed in northern Gaza, despite the ceasefire agreed in October 2025.' },
  { id: 'nigeria', place: 'Nigeria', region: 'AF', field: 'DISASTER', badge: 'R', src: 'Reuters', art: 'boat', label: '24 DEAD',
    head: 'Boat capsizes, at least 24 people dead',
    sum: 'Toll as reported by Reuters' },
  { id: 'png', place: 'Papua New Guinea', region: 'OC', field: 'CLIMATE', badge: 'R', src: 'RNZ Pacific', art: 'drought', label: 'DROUGHT',
    head: 'Wildfires and drought grip PNG',
    sum: 'Solomons: fish kills, water short' },
  { id: 'iran', place: 'Tehran', region: 'ME', field: 'DIPLOMACY', badge: 'O', src: 'Iran MFA', art: 'podium', label: 'IRGC WARNING',
    head: 'Iran vows to answer any US attack',
    sum: 'Spokesman Esmail Baghaei' },
  { id: 'nepal', place: 'New Delhi', region: 'SA', field: 'AID', badge: 'O', src: 'Morning Star', art: 'flood', label: '$1.6bn',
    head: 'India pledges $1.6bn for Nepal floods',
    sum: 'Modi met Nepal PM Balendra Shah' },
  { id: 'congo', place: 'DR Congo', region: 'AF', field: 'HEALTH', badge: 'O', src: 'WHO', art: 'health', label: 'EBOLA',
    head: 'WHO calls for peace in Ebola-hit DR Congo',
    sum: 'Appeal for peace amid outbreak' },
  { id: 'nvidia', place: 'Washington', region: 'NA', field: 'MARKETS', badge: 'R', src: 'Reuters', art: 'chip', label: 'SEC PROBE',
    head: "SEC probes Nvidia's accounting, sources say",
    sum: 'Reuters, citing sources' },
  { id: 'estonia', place: 'Moscow', region: 'EU', field: 'SECURITY', badge: 'CL', src: 'Russian govt', art: 'border', label: '"OPEN WAR"',
    head: 'Moscow says Estonia risks an "open war"',
    sum: "Russia's charge; one side only" },
  { id: 'emmys', place: 'New York', region: 'NA', field: 'CULTURE', badge: 'C', src: 'Deadline, THR', art: 'trophy', label: 'CARÊME',
    head: "Carême wins International Emmy",
    sum: 'Best drama, France; UK wins 9 of 16' },
  { id: 'thai', place: 'Bangkok', region: 'SE', field: 'JUSTICE', badge: 'R', src: 'Morning Star', art: 'bars', label: '3 YEARS, NOT 6',
    head: "Court halves MP's royal defamation term",
    sum: 'Conviction upheld on appeal' },
  { id: 'westbank', place: 'West Bank', region: 'ME', field: 'HUMAN RIGHTS', badge: 'C', src: 'Reuters, Democracy Now', art: 'arson', label: 'ARSON',
    head: 'Settler arson hits Palestinian villages',
    sum: 'Israeli opposition demands action' },
  // list items: place + one short sentence with a figure
  { id: 'hodeidah', place: 'Hodeidah', region: 'ME', field: 'CONFLICT', badge: 'CL', src: 'Houthi media', sum: 'Houthis say Saudi strike killed 4, hurt 18' },
  { id: 'slovyansk', place: 'Slovyansk, Ukraine', region: 'EU', field: 'CONFLICT', badge: 'R', src: 'Open Chronicle', sum: 'Russian air strikes reported to kill 2' },
  { id: 'china', place: 'Beijing', region: 'EA', field: 'JUSTICE', badge: 'R', src: 'Reuters', sum: 'Official sentenced to death for leaking secrets' },
  { id: 'sanctions', place: 'Brussels', region: 'EU', field: 'SANCTIONS', badge: 'R', src: 'Open Chronicle', sum: 'EU outlines a new round of penalties on Russia' },
  { id: 'magyar', place: 'Budapest', region: 'EU', field: 'DIPLOMACY', badge: 'R', src: 'Reuters', sum: 'PM Péter Magyar says he will visit Ukraine soon' },
  { id: 'dewever', place: 'Belgium', region: 'EU', field: 'ECONOMY', badge: 'R', src: 'Reuters', sum: 'PM De Wever sets 31 Dec budget deadline' },
  { id: 'house', place: 'Washington', region: 'NA', field: 'POLITICS', badge: 'R', src: 'Reuters', sum: 'Democrats flip 47 House seats so far' },
  { id: 'fbi', place: 'United States', region: 'NA', field: 'CYBER', badge: 'R', src: 'Reuters', sum: 'FBI probes hack of a police database' },
  { id: 'ice', place: 'Seattle', region: 'NA', field: 'MIGRATION', badge: 'R', src: 'Democracy Now', sum: 'ICE airport arrest of father, daughter sparks outcry' },
  { id: 'rikers', place: 'New York', region: 'NA', field: 'JUSTICE', badge: 'R', src: 'Democracy Now', sum: 'Plan to close the Rikers Island jail by 2032' },
  { id: 'palermo', place: 'Argentina', region: 'LA', field: 'CULTURE', badge: 'C', src: 'Deadline, THR', sum: "División Palermo wins Int'l Emmy for comedy" },
  { id: 'pollution', place: 'Gaza', region: 'ME', field: 'ENVIRONMENT', badge: 'R', src: 'Al Jazeera', sum: 'Report blames Israel for pollution in 99% of Gaza' },
  { id: 'madrid', place: 'Spain', region: 'EU', field: 'JUSTICE', badge: 'R', src: 'Democracy Now', sum: 'Court bails an activist held on a US-backed request' },
  { id: 'fiji', place: 'Fiji', region: 'OC', field: 'POLITICS', badge: 'R', src: 'Fiji Sun', sum: "Group of 11 MPs apply to run for People's Alliance" },
  { id: 'unity', place: 'Israel', region: 'ME', field: 'POLITICS', badge: 'R', src: 'Times of Israel', sum: 'Eisenkot and Bennett split over a Likud deadline' },
];

// Date check: kept off the page, or flagged.
export const dateCheck = {
  leftOut: [
    'COP31 talks in Antalya collapsed on Sun 22 Nov',
    'EU–Indonesia trade deal was signed on 21 Nov',
    'Houthi drone hit on a Riyadh tower was 24 Nov',
    "Zambia's treason charges date from August",
  ],
  notYet: [
    'New Zealand election result due 27 Nov',
    'US Army lead azide blast in Iowa set for 25 Nov',
  ],
  updated: [
    'Tolls are the first 23 Nov figures, "at least"',
    'No later rises found by 24 Nov 23:00 UTC',
  ],
};

export const footer = {
  method: 'Stories happened or were first reported on Mon 23 Nov 2026',
  sources: 'RNZ Pacific, Fiji Sun, UKMTO, Al Jazeera, CNN, Reuters, UNRWA, WHO, Morning Star, Democracy Now, Deadline, THR, Times of Israel',
  fonts: 'PT Serif & PT Sans (OFL, ParaType)',
};
