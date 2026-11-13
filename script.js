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
const dialog = document.querySelector('#survey-dialog');
const dialogIcon = document.querySelector('#dialog-icon');
const dialogOverline = document.querySelector('#dialog-overline');
const dialogTitle = document.querySelector('#dialog-title');
const dialogMessage = document.querySelector('#dialog-message');
const dialogDetail = document.querySelector('#dialog-detail');
const submitBtn = document.querySelector('#survey-submit');
const surveyStatus = document.querySelector('#survey-status');

function firstName(fullName) {
  const first = fullName.trim().split(/\s+/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function openDialog(kind, name, detail) {
  if (kind === 'success') {
    dialogIcon.textContent = '✓';
    dialogIcon.className = 'dialog-icon success';
    dialogOverline.textContent = 'VOICE OF THE PEOPLE';
    dialogTitle.textContent = name ? `Thank you, ${name}!` : 'Thank you!';
    dialogMessage.textContent = name
      ? 'Your community priority has been received. Voices like yours help shape a greater Lagos.'
      : 'Your community priority has been received. Voices like yours help shape a greater Lagos.';
  } else if (kind === 'error') {
    dialogIcon.textContent = '!';
    dialogIcon.className = 'dialog-icon error';
    dialogOverline.textContent = 'PLEASE TRY AGAIN';
    dialogTitle.textContent = name ? `Sorry, ${name} — something went wrong` : 'Something went wrong';
    dialogMessage.textContent = 'We could not send your response just now. Please check your connection and try again in a moment.';
  } else {
    dialogIcon.textContent = '!';
    dialogIcon.className = 'dialog-icon error';
    dialogOverline.textContent = 'ALMOST THERE';
    dialogTitle.textContent = 'Please complete the form';
    dialogMessage.textContent = 'A few required fields still need your attention. Please review the highlighted items and try again.';
  }
  dialogDetail.textContent = detail || '';
  dialog.hidden = false;
  document.body.style.overflow = 'hidden';
  dialog.querySelector('#dialog-done').focus();
}

function closeDialog() {
  dialog.hidden = true;
  document.body.style.overflow = '';
}

dialog.querySelector('#dialog-done').addEventListener('click', closeDialog);
dialog.querySelector('#dialog-close').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !dialog.hidden) closeDialog(); });

if (survey) {
  survey.addEventListener('submit', async event => {
    event.preventDefault();
    if (!survey.checkValidity()) {
      const nameField = survey.elements.name.value;
      openDialog('incomplete', firstName(nameField), '');
      survey.reportValidity();
      return;
    }
    const data = new FormData(survey);
    const name = data.get('name') ? firstName(String(data.get('name'))) : '';
    const priority = data.get('priority') || '';
    const community = data.get('community') || 'your community';
    const urgency = data.get('urgency') || '';

    submitBtn.disabled = true;
    surveyStatus.textContent = 'Sending your response…';
    try {
      const response = await fetch(survey.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      if (response.ok) {
        const detail = [priority, `${community}`, urgency].filter(Boolean).join(' · ');
        openDialog('success', name, detail);
        survey.reset();
        surveyStatus.textContent = '';
      } else {
        openDialog('error', name, '');
        surveyStatus.textContent = '';
      }
    } catch {
      openDialog('error', name, '');
      surveyStatus.textContent = '';
    } finally {
      submitBtn.disabled = false;
    }
  });
}
