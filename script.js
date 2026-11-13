const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

const survey = document.querySelector('#priority-survey');
if (survey) {
  survey.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(survey);
    const subject = 'Lagos community priority suggestion';
    const body = [
      `Priority need: ${data.get('priority')}`,
      `Community / LGA / LCDA: ${data.get('community') || 'Not specified'}`,
      `Timeframe: ${data.get('urgency')}`,
      '',
      'Suggested quick intervention:',
      data.get('intervention')
    ].join('\n');
    const mailto = `mailto:joansvilletechies@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.querySelector('#survey-status').textContent = 'Your email app should open with the suggestion ready to review. Press Send in your email app to submit it.';
    window.location.href = mailto;
  });
}
