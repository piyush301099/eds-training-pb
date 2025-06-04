export default function loadingButtonSetState({
  id,
  state,
} = {}) {
  if (!id) {
    // eslint-disable-next-line no-console
    console.error('ux-lds - setLoadingButtonState: id (string) is required');
    return;
  }

  const validStates = ['ready', 'loading', 'success', 'failure'];
  if (!validStates.includes(state)) {
    // eslint-disable-next-line no-console
    console.error(`ux-lds - setLoadingButtonState: state (string) must be one of the following values: ${validStates}`);
    return;
  }

  const elementWrapper = document.getElementById(id);
  if (!elementWrapper) {
    // eslint-disable-next-line no-console
    console.error(`ux-lds - setLoadingButtonState: unable to find element with id ${id}`);
  }
  const button = elementWrapper.querySelector('button');
  if (!button) {
    // eslint-disable-next-line no-console
    console.error(`ux-lds - setLoadingButtonState: unable to find button element in wrapper with id ${id}`);
  }

  if (state === 'ready') {
    elementWrapper.classList.remove('loading', 'success', 'failure');

    button.classList.remove('loading', 'success', 'loading-failure');
    button.removeAttribute('disabled');
  } else if (state === 'loading') {
    elementWrapper.classList.remove('success', 'failure');
    elementWrapper.classList.add('loading');

    button.classList.remove('success', 'loading-failure');
    button.classList.add('loading');
    button.setAttribute('disabled', 'disabled');
  } else if (state === 'success') {
    elementWrapper.classList.remove('loading', 'failure');
    elementWrapper.classList.add('success');

    button.classList.remove('loading', 'loading-failure');
    button.classList.add('success');
    button.setAttribute('disabled', 'disabled');
  } else if (state === 'failure') {
    elementWrapper.classList.remove('loading', 'success');
    elementWrapper.classList.add('failure');

    button.classList.remove('loading', 'success');
    button.classList.add('loading-failure');
    button.setAttribute('disabled', 'disabled');
  }
}
