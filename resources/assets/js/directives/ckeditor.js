function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

Vue.directive('ckeditor', {
    twoWay: true,

    bind: function () {
        $(document).ready(function() {
            var tempId = '';
            do {
                tempId = makeid();
            } while (document.querySelectorAll('#' + tempId).length );

            this.el.id = tempId;

            var that = this;

            // Needs to be wrapped in a setTimeout or else the textarea isnt ready yet... weird.
            setTimeout(function() {
                var editor = CKEDITOR.replace(tempId);

                editor.on( 'change', function( evt ) {
                    that.set(evt.editor.getData());
                });
            }, 250)
        }.bind(this));
    },

    unbind: function() {

    }
});

Vue.directive('simplemde', {
    twoWay: true,

    bind: function() {
        $(document).ready(function() {
            var tempId = '';
            do {
                tempId = makeid();
            } while (document.querySelectorAll('#' + tempId).length );

            this.el.id = tempId;

            var that = this;

            setTimeout(function () {
                // Needs to be wrapped in a setTimeout or else the textarea isnt ready yet... weird.
                var editor = new SimpleMDE({ element: document.getElementById(tempId) });

                editor.codemirror.on('change', function() {
                    that.set(editor.value());
                });
            }, 250);


        }.bind(this));
    }
});