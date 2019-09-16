
const addZero = (i) => {
  let j = i;
  if (i < 10) {
    j = `0${i}`;
  }
  return j;
};

const fechaDeHoy = () => {
  const hoy = new Date();
  let dd = hoy.getDate();
  let mm = hoy.getMonth() + 1;
  const yyyy = hoy.getFullYear();

  dd = addZero(dd);
  mm = addZero(mm);

  // return `${dd}/${mm}/${yyyy}`;
  return `${yyyy}/${mm}/${dd}`;
};

module.exports = { fechaDeHoy };
