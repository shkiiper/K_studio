const RECAPTCHA2_PUBLIC_KEY = '6LdrxSgoAAAAADCFHy72H5WdYrdxAI3bWJOoBxXp';
const RECAPTCHA3_PUBLIC_KEY = '6LcUhvMmAAAAAAWq0LekHjyB82VRKFlV80OHeCGn';

const makeRecaptchaBlock = function () {
    let form = window.formData.currentForm;
    let widget = document.createElement('div');
    widget.id = 'recaptchaV2-widget';
    widget.classList.add('g-recaptcha');
    widget.style.margin = '15px 0';
    widget.setAttribute('data-sitekey', RECAPTCHA2_PUBLIC_KEY);
    form.append(widget);
    widget.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

const getFormData = function (form, token, firstKey) {
    form.find('input[name="g-recaptcha-token"]').remove();
    form.find('input[name="g-recaptcha-key"]').remove();
    form.append("<input type='hidden' name='g-recaptcha-token' value='" + token + "'/>");
    form.append("<input type='hidden' name='g-recaptcha-key' value='" + firstKey + "'/>");
    return form.serialize();
}

const handleRecaptchaV2Response = function (response) {
    if (!response) {
        handleErrorResponse('recaptcha not valid');
        return
    }

    $('#recaptchaV2-widget').remove();
    makeRequest(response, RECAPTCHA2_PUBLIC_KEY);
}

const handleErrorResponse = function (error) {
    let form = window.formData.currentForm;
    let submit = form.find('[type=submit]');
    let currentValue = window.formData.currentValue;
    let container = form.parent();
    let doneBlock = $(".w-form-done", container);
    let failBlock = $(".w-form-fail", container);

    // show error (fail) block
    form.show();
    doneBlock.hide();
    failBlock.show();
    submit.attr('disabled', false).val(currentValue);
}

const makeRequest = function (
    token,
    firstKey,
    successCallback,
    errorCallback
) {
    let form = window.formData.currentForm;
    let submit = form.find('[type=submit]');
    let currentValue = window.formData.currentValue;
    let container = form.parent();
    let doneBlock = $(".w-form-done", container);
    let failBlock = $(".w-form-fail", container);
    $.ajax({
        type: form.attr("method"),
        url: form.attr("action"),
        data: getFormData(form, token, firstKey),
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        dataType: 'json',
        success: function (resultData) {
            if (typeof successCallback === 'function') {
                // call custom callback
                let result = successCallback(resultData);
                if (!result) {
                    // show error (fail) block
                    form.show();
                    doneBlock.hide();
                    failBlock.show();
                    submit.attr('disabled', false).val(currentValue);
                    return;
                }
            }
            // show success (done) block
            form.hide();
            doneBlock.show();
            failBlock.hide();
            submit.attr('disabled', false).val(currentValue);
            setFormEventDataLayer(true);
        },
        error: function (xhr, status, error) {
            let responseJSON = xhr.responseJSON;
            if (responseJSON.message === 'recaptcha v3 not valid') {
                makeRecaptchaBlock();
                window.grecaptchaWidget = grecaptcha.render('recaptchaV2-widget', {
                    'sitekey': RECAPTCHA2_PUBLIC_KEY,
                    'callback': handleRecaptchaV2Response
                });
                return;
            }

            // call custom callback
            if (typeof errorCallback === 'function') {
                errorCallback(xhr);
                submit.attr('disabled', false).val(currentValue);
            }
            handleErrorResponse(responseJSON.message);
            setFormEventDataLayer(false, responseJSON.message);
        }
    });
}

const makeWebflowFormAjax = function (forms, successCallback, errorCallback) {
    let firstKey = RECAPTCHA3_PUBLIC_KEY;
    forms.each(function () {
        let form = $(this);
        form.on("submit", function (event) {
            event.preventDefault();
            let submit = form.find('[type=submit]'),
                currentValue = submit.val(),
                waitValue = submit.data('wait');
            submit.attr('disabled', true).val(waitValue);
            window.formData = {
                currentForm: form,
                currentValue: currentValue
            }
            grecaptcha.ready(function () {
                grecaptcha.execute(firstKey, {action: 'homepage'})
                    .then(function (token) {
                        makeRequest(token, firstKey, successCallback, errorCallback);
                    });
            });
            return false;
        });
    });
}
makeWebflowFormAjax($('form[data-submition-type="ajax"], [data-submition-type="ajax"] form'));