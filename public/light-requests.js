let circleColor
let circleBrightness

$(window).on('load', function () {
  getCurrentLightParameters()
})

function getCurrentLightParameters() {
  const param = {
    'action': 'status'
  }

  fetch(`command?${new URLSearchParams(param)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
    .then(handleResponseStatus)
    .then((response) => {
      response.json().then((data) => {
        if (data.properties[0].online == 'false') {
          var error = new Error('Device is offline')
          displayError(error, false)
        }
        else {
          // Retrieve favorites
          getFavs()
          // Set color picker with the active color of the light
          setColorPicker(data.properties[3].color)
          // Current brightness
          setCircleBrightness(data.properties[2].brightness)
          // Current powerstate
          setPowerState(data.properties[1].powerState)
          // Set switch state
          toggleLightParamsInputs()
          // Set background circle
          setBackgroundCircle(circleColor, circleBrightness)
          // Display main page container
          $('.container').fadeIn()
        }
      })
        .catch((error) => {
          displayError(error, false)
        })
    })
    .catch((error) => {
      displayError(error, false)
    })
    .finally(() => {
      // Hide loader
      $('#loader').fadeOut()
    })
}

function toggleOnOff() {
  const param = {
    'action': $('#switch').is(':checked') ? 'start' : 'stop'
  }

  fetch(`command?${new URLSearchParams(param)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
    .then(handleResponseStatus)
    .then(() => {
      param.action == 'start' ? $('#lightBackground').fadeIn() : $('#lightBackground').fadeOut()
      toggleLightParamsInputs()
    })
    .catch(error => {
      displayError(error)
    })
}

function changeColor(color, favorites) {
  let rgb
  if (favorites) {
    //Value is already in format rgb(x, x, x)
    rgb = color.substring(4).replace(/\)|\s/g, '').split(',')
    //converting to hex to set color picker
    let hex = rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]))
    document.getElementById('colorPicker').value = hex
  }
  //Hex to RGB
  else {
    rgb = color.match(/[A-Za-z0-9]{2}/g).map(function (v) {
      return parseInt(v, 16)
    })
  }

  let data = {}
  data.r = rgb[0]
  data.g = rgb[1]
  data.b = rgb[2]

  const param = {
    'action': 'setColor'
  }

  fetch(`command?${new URLSearchParams(param)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data)
  })
    .then(handleResponseStatus)
    .then(() => {
      setBackgroundCircle(color, circleBrightness)
      circleColor = color
    })
    .catch((error) => {
      displayError(error)
    })
}

function changeBrightness(brightness) {
  let data = {}
  data.brightness = brightness.value

  const param = {
    'action': 'setBrightness'
  }

  fetch(`command?${new URLSearchParams(param)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data)
  })
    .then(handleResponseStatus)
    .then(() => {
      setBackgroundCircle(circleColor, brightness.value)
      circleBrightness = brightness.value
    })
    .catch(error => {
      displayError(error)
    })
}

function getFavs() {
  const param = {
    'action': 'readFavs'
  }

  fetch(`command?${new URLSearchParams(param)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
    .then(handleResponseStatus)
    .then(response => {
      response.json().then((data => {
        if (data !== undefined) {
          $('#favorites-container').html('')
          jQuery.each(data.favorites, function (index, val) {
            appendFavItem(val)
          })
        }
      }))
        .catch(error => {
          displayError(error)
        })
    })
    .catch(error => {
      displayError(error)
    })
}

function addToFav() {
  let data = {}
  data.color = $('#colorPicker').val()

  const param = {
    'action': 'writeFav'
  }

  fetch(`command?${new URLSearchParams(param)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data)
  })
    .then(handleResponseStatus)
    .then(response => {
      response.json().then((data => {
        appendFavItem(data)
        $(`#favorite_${data.id}`).hide()
        $(`#favorite_${data.id}`).fadeIn()
      }))
        .catch(error => {
          displayError(error)
        })
    })
    .catch(error => {
      displayError(error)
    })
}

function deleteFav(favId) {
  let data = {}
  data.id = favId

  const param = {
    'action': 'deleteFav'
  }

  fetch(`command?${new URLSearchParams(param)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data)
  })
    .then(handleResponseStatus)
    .then(() => {
      $(`#favorite_${favId}`).remove()
      $(`#delete_${favId}`).remove()
      getFavs()
    })
    .catch((error) => {
      displayError(error)
    })
}

const handleResponseStatus = response => {
  if (!response.ok) {
    let statusText = response.statusText
    if(response.status == 401) {
      statusText += ': check config file?'
    }
    throw Error(statusText)
  } else {
    return response
  }
}