$(document).ready(() => {

    $("#inputAddress").keydown(event => {
        if (event.keyCode == 13) {
            this.form.submit();
            return false;
        }
    });

});

