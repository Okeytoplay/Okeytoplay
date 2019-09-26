
// $(document).ready(() => {
//   $(".alerts").first().hide().fadeIn(200).delay(2000).fadeOut(1000, function () { $(this).remove(); });
// });

// function fadeIn(el, time) {
//   // el.style.opacity = 0;

//   let last = +new Date();
//   let tick = () => {
//     el.style.opacity = +el.style.opacity + (new Date() - last) / time;
//     last = +new Date();

//     if (+el.style.opacity < 1) {
//       (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
//     }
//   };

//   tick();
// }

document.addEventListener('DOMContentLoaded', () => {
  // code
  // document.getElementById('notifications').style.display = 'none';
  const notify = document.getElementById('notifications');
  notify.style.transition = 'top 6s';
  notify.style.top = '-50px';

  //fadeIn(notify, 2000);
});
