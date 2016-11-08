function handleError(error) {
  if (error) {
    console.log(error, error.stack);
    var text = '';

    if (error.name) {
      text += error.name + ': ';
    }

    text += error.message;

    if (error.stack) {
      text = + ' | ' + error.stack.toString();
    }
    updateStatusMessage(text);
  }
}

function updateStatusMessage(text) {
  var statusMessage = document.getElementById('status-message');
  statusMessage.textContent = text;
  statusMessage.classList.remove('hidden');
}

module.exports = handleError;
