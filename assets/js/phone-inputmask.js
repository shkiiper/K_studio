const host = location.host;

/**
 *  Получение кнопки формы
 */
function getSubmitButton(input)
{
    let form = input.parent().parent();
    return form.find('input[type="submit"]');
}


$(document).ready(function () {
    let phoneInputs = $('input[name="phone"]');
    if (typeof ($.masksLoad) === 'function') {
        var maskList = $.masksSort($.masksLoad('https://' + host + '/js/phone-codes.json'), ['#'], /[0-9]|#/, 'mask');
        var maskOpts = {
            inputmask: {
                oncomplete: function (event) {
                    $(event.currentTarget).removeClass('has-error-border-color');
                    $(event.currentTarget).prev().removeClass('has-error-color');
                    let submitButton = getSubmitButton($(event.currentTarget));
                    submitButton.attr("disabled", false);
                },
                onincomplete: function (event) {
                    let inputValue = $(event.currentTarget).val()
                    if (inputValue === '' || inputValue === $(event.currentTarget).placeholder) {
                        return;
                    }
                    $(event.currentTarget).addClass('has-error-border-color');
                    $(event.currentTarget).prev().addClass('has-error-color');
                    let submitButton = getSubmitButton($(event.currentTarget));
                    submitButton.attr("disabled", true);
                    window.formData = {currentForm: $(submitButton[0].form)};
                    setFormEventDataLayer(false, 'Incorrect phone value - ' + inputValue);
                },
                definitions: {
                    '#': {
                        validator: "[0-9]",
                        cardinality: 1
                    }
                },
                showMaskOnHover: false,
                autoUnmask: true
            },
            match: /[0-9]/,
            replace: '#',
            list: maskList,
            listKey: 'mask',
            onMaskChange: function (maskObj, completed) {
                $(this).attr("placeholder", $(this).inputmask("getemptymask"));
            }
        };

        phoneInputs.each((phoneInputIndex, phoneInput) => {
            $(phoneInput).inputmasks(maskOpts);
        })
    }
});