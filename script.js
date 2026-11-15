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
  survey.addEventListener('submit', async event => {
    event.preventDefault();
    const status = document.querySelector('#survey-status');
    const button = survey.querySelector('button[type="submit"]');
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = 'Sending your suggestion…';
    try {
      const response = await fetch(survey.action, {
        method: 'POST',
        body: new FormData(survey),
        headers: { Accept: 'application/json' }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Your suggestion could not be sent. Please try again.');
      status.textContent = result.message;
      survey.reset();
    } catch (error) {
      status.textContent = error.message || 'Could not reach the server. Please try again later.';
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  });
}
