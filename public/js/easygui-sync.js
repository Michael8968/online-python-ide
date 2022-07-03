function easyguiEventListen() {
  $("#dialog").on("dialogopen", function(event, ui) {
    const input = $("#dialog #usercontent");
    if (input) {
      input.on('input', function() {
        onInputHandler($(this).val())
      });
    }
    const buttons = $(".ui-dialog button");
    if (buttons) {
      buttons.map((index, button) => {
        // console.log('button classname : ', button);
        button.addEventListener('click', function(event) {
          // console.log('click : ', index, event);
          onButtonHandler(index)
        })
      })
    }
  });
}

function onInputHandler(text) {
  // console.log('input : ', text);
  const data = {
    text: text,
    type: 'input',
  }
  source.postMessage({ type: 'easygui', value: data }, origin)
}

function onButtonHandler(index) {
  // console.log('click : ', index);
  const data = {
    index: index,
    type: 'click',
  }
  source.postMessage({ type: 'easygui', value: data }, origin)
}
