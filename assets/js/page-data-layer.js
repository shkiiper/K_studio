const SENT_SUCCESS = 'Form_Sent_Successfully';
const SENT_ERROR = 'Form_Sent_Error';
const HEADER_LINK = 'Header_Menu_Interaction';
const FOOTER_LINK = 'Footer_Menu_Interaction';

/**
 * @return {string}
 */
const getFormType = function () {
    let form = window.formData.currentForm;
    return form.attr('data-form-type') || '';
}

/**
 * @return {string}
 */
const getFormLocation = function () {
    let form = window.formData.currentForm;
    return form.attr('data-form-location') || '';
}

/**
 * @return {string}
 */
const getDeviceID = function () {
    let deviceId = getCookie('_ga') || '';
    let gaBlock = new RegExp('^GA[0-9]\.[0-9]\.', 'g');

    return deviceId.replace(gaBlock, '');
}

/**
 * @param key
 * @return {null|string}
 */
const getCookie = function (key) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieKey, cookieValue] = cookie.trim().split('=');
        if (cookieKey === key) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

/**
 * @param formSentResult {boolean}
 * @param error {string}
 */
const setFormEventDataLayer = function (
    formSentResult,
    error = 'Something went wrong while submitting the form.'
) {
    let eventData = {
        event: formSentResult ? SENT_SUCCESS : SENT_ERROR,
        deviceID: getDeviceID(),
        formType: getFormType(),
        FormLocation: getFormLocation()
    };
    if (!formSentResult) {
        eventData.error = error;
    }

    window.dataLayer.push(eventData);
}

/**
 * @param linkType {string} select from [HEADER_LINK, FOOTER_LINK]
 * @param linkText {string}
 */
const setLinkEventData = function (linkType, linkText) {
    let eventData = {
        event: linkType,
        clickedItem: linkText
    };
    window.dataLayer.push(eventData);
}

/**
 * @param event
 */
const headerLinkHandle = function (event) {
    if (event.originalEvent.button === 2) {
        return;
    }

    let linkText = this.innerText;
    if (linkText === '' && this.firstElementChild.tagName === 'IMG') {
        linkText = this.firstElementChild.alt;
    }

    setLinkEventData(HEADER_LINK, linkText);
}

/**
 * @param event
 */
const footerLinkHandle = function (event) {
    if (event.originalEvent.button === 2) {
        return;
    }

    let linkText = this.innerText;
    if (linkText === '' && this.firstElementChild.tagName === 'IMG') {
        linkText = this.firstElementChild.alt;
    }

    setLinkEventData(FOOTER_LINK, linkText);
}

/**
 * @param form
 * @return {string}
 */
const validateForm = function (form) {
    for (let index in form) {
        let input = form[index];
        if (input.validity.valid) {
            continue;
        }

        return  input.validationMessage + ' - ' + input.name;
    }

    return 'errorMessage';
}

/**
 * @param event
 */
const submitClickFormSentError = function (event) {
    let form = event.currentTarget.form;
    window.formData = {currentForm: $(form)};
    let  errorMessage = validateForm(form);
    setFormEventDataLayer(false, errorMessage);
}

$(() => {
    $('.navbar-desktop-netpeak-site.w-nav a').mousedown(headerLinkHandle);
    $('.navbar_desktop_netpeak-site.w-nav a').mousedown(headerLinkHandle);
    $('.navbar_mobile_netpeak-site.w-nav a').mousedown(headerLinkHandle);
    $('.navbar-mobile-netpeak-site.w-nav a').mousedown(headerLinkHandle);
    $('footer a').mousedown(footerLinkHandle);
    $('input[type=submit]').click(submitClickFormSentError);
});