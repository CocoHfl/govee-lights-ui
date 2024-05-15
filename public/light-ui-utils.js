function setPowerState(powerState) {
    if (powerState == 'on') {
        $('#switch').prop('checked', true)
        $('#lightBackground').fadeIn()
    } else {
        $('#switch').prop('checked', false)
        $('#lightBackground').hide()
    }
}

function setCircleBrightness(brightness) {
    circleBrightness = brightness
    document.getElementById('brightness').value = circleBrightness
}

function setColorPicker(color) {
    circleColor = rgbToHex(color?.r ?? 255, color?.g ?? 255, color?.b ?? 255)
    document.getElementById('colorPicker').value = circleColor
}

function toggleLightParamsInputs() {
    let switchEnabled = $('#switch').is(':checked')
    $('.light-params').css({
        'pointer-events': switchEnabled ? 'auto' : 'none',
        'opacity': switchEnabled ? '' : '0.5'
    })
}

function setBackgroundCircle(color, brightness) {
    $('#lightBackground').css(
        'box-shadow',
        '0 0 ' +
        (brightness == '0' ? '0px ' : '50px ') +
        brightness / 3 +
        'px ' +
        color
    )

    if (color != circleColor) {
        $('#lightBackground').hide()
        $('#lightBackground').fadeIn()
    }
}

function displayError(error, timeout = true) {
    $('#snackbar').empty()
    $('#snackbar').append(error.message ?? "An error occured")
    $('#snackbar').slideDown('slow')

    if (timeout) {
        setTimeout(function () {
            $('#snackbar').fadeOut()
        }, 3000)
    }
}

function rgbToHex(r, g, b) {
    return '#'.concat(componentToHex(r), componentToHex(g), componentToHex(b))
}

function componentToHex(c) {
    let hex = c.toString(16)
    return hex.length == 1 ? '0' + hex : hex
}

function appendFavItem(favorite) {
    $('#favorites-container').append(
        `<span id="favorite_${favorite.id}" class="favorite-box" style="background-color:${favorite.color}"></span>`
    )
    $('#favorites-container').append(
        `<img id="delete_${favorite.id}" class="delete" src="imgs/delete.svg" />`
    )
    $(`#favorite_${favorite.id}`).click(function () {
        changeColor($(this).css('background-color'), true)
    })
    $(`#delete_${favorite.id}`).click(function () {
        deleteFav(favorite.id)
    })
}
