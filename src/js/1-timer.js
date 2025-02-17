import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dateInput = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const timerFields = {
  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]")
};

let userSelectedDate = null;
let countdownInterval = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    userSelectedDate = selectedDate;
    
    if (selectedDate < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future.',
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  }
};

flatpickr(dateInput, options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  timerFields.days.textContent = addLeadingZero(days);
  timerFields.hours.textContent = addLeadingZero(hours);
  timerFields.minutes.textContent = addLeadingZero(minutes);
  timerFields.seconds.textContent = addLeadingZero(seconds);
}

function startCountdown() {
  const targetTime = userSelectedDate.getTime();
  
  countdownInterval = setInterval(() => {
    const currentTime = Date.now();
    const timeRemaining = targetTime - currentTime;

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      iziToast.success({
        title: 'Success',
        message: 'The countdown has finished!',
      });
      startButton.disabled = true;
      dateInput.disabled = false;
    } else {
      const { days, hours, minutes, seconds } = convertMs(timeRemaining);
      updateTimerDisplay({ days, hours, minutes, seconds });
    }
  }, 1000);

  startButton.disabled = true;
  dateInput.disabled = true;
}

startButton.addEventListener("click", startCountdown);