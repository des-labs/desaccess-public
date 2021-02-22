
export const validateEmailAddress = function(emailStr) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(emailStr).toLowerCase());
}

export const validatePassword = function(password) {
  const re = /^[a-zA-Z]+[a-zA-Z0-9]+$/;
  return re.test(password) && password.length <= 40 && password.length >= 10;
}

export const convertToLocalTime = function(datetimeString) {

  let inputDateTime = Date.parse(datetimeString);
  let displayTime = new Date(inputDateTime);
  let convertedDateTime = 
    displayTime.getFullYear() + "/" + (((displayTime.getMonth()+1) < 10)?"0":"") + (displayTime.getMonth()+1) + "/" + ((displayTime.getDate() < 10)?"0":"") + displayTime.getDate()
    + ' ' +
    ((displayTime.getHours() < 10)?"0":"") + displayTime.getHours() +":"+ ((displayTime.getMinutes() < 10)?"0":"") + displayTime.getMinutes() +":"+ ((displayTime.getSeconds() < 10)?"0":"") + displayTime.getSeconds();
  return convertedDateTime;
}

export const scrollToTop = function(e) {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

export const scrollToElement = function(el, offset = 60) {
  window.scrollTo({
    top: el.getBoundingClientRect().top - offset,
    behavior: 'smooth'
  });
}