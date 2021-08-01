let nav = 0;
let clicked = null;
let checked  = localStorage.getItem('checked');
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// localStorage.removeItem('checked')

function checkedIn(date) {
  clicked = date;
  const eventForDay = events.find(e => e.date === clicked);
  if (eventForDay) {
    checked--;
    document.getElementById('eventText').innerText = eventForDay.title;
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('checked', Number(checked));
    document.getElementById('footerChecked').innerHTML = checked;
    load();
  } else if(eventTitleInput.value) {
    checked++;
    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('checked', Number(checked));
    document.getElementById('footerChecked').innerHTML = checked;
    load();
  }
}

function load() {
  const dt = new Date();

  document.getElementById('footerChecked').innerHTML = checked;
  
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }
  
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  
  const firstDayOfMonth = new Date(year, month, 1);
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

  calendar.innerHTML = '';
  
  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');
    
    const dayString = `${month + 1}/${i - paddingDays}/${year}`;
    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find(e => e.date === dayString);
      
      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }
      daySquare.addEventListener('click', () => checkedIn(dayString));
      
    } else {
      daySquare.classList.add('padding');
    }
    calendar.appendChild(daySquare);
  }

  // If current day, then use click checked
  // const currentMonth = new Date().getMonth();
  // if(month === currentMonth){
  //   const getCurrentDay = document.querySelector('#currentDay')
  //   getCurrentDay.classList.remove('testCurrentDay')
  // }
}

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });
}

initButtons();
load();
