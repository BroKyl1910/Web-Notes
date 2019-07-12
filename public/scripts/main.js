setDraggableResizable();
// addDeleteButtonListener();

var clickedHeader = null;
$(".header-wrapper" ).on("click", function(evt) {
    clickedHeader = evt.currentTarget;
    $(clickedHeader).siblings('.body-wrapper').children().blur();
});

function postData(note){
    var textarea = note.find('.note-textarea');    
    $.ajax({
        type: 'PUT',
        url: '/notes',
        data: {
            id: $(textarea).attr('data-id'),
            body: $(textarea).val(),
            height: $(note).innerHeight(),
            width: $(note).outerWidth(),
            top: $(note).position().top,
            left: $(note).position().left
        },
        success: function(res){
            console.log(res);
        }
    });
}

$("#add-button").on("click", (evt) => {
    console.log("Making AJAX call");
    $.ajax({
        type: 'POST',
        url: '/notes',
        success: function(res){
            console.log(res);
            var newNote = $('#note-template').clone().removeAttr("id").appendTo($('body'));
            $(newNote).attr('data-id', res._id);
            $(newNote).css('display', 'block');
            $(newNote).find('.ui-resizable-handle').remove();
            setDraggableResizable();
            $(newNote).find('.header-icon i').attr('data-id', res._id);
            $(newNote).find('.note-textarea').attr('data-id', res._id);
            $(newNote).find('.note-textarea').attr('placeholder', 'New note...');
            
        }
    });
});

function setDraggableResizable(){
    $('.note-wrapper').draggable({
        stack: ".note-wrapper",
        stop: function() {
            postData($(this));
        }
    }).resizable({
        stop: function() {
            postData($(this));
        }
    });
}

$('body').on('click', '.delete-button', function(evt) {
    evt.stopPropagation();
    deleteButtonClicked(evt);
});

$('body').on('change', '.note-textarea', function(evt) {
    console.log("Text changed");
    note = $(evt.currentTarget).parents('.note-wrapper'); 
    postData(note);
});

function deleteButtonClicked(evt){
    console.log(evt);
    var target = evt.currentTarget;
    var id = $(target).attr('data-id');
    var note = $('div[data-id='+id+']');
    console.log("Making AJAX call");
    $.ajax({
        type: 'DELETE',
        url: '/notes?id='+$(target).attr('data-id'),
        success: function(res){
            console.log(res);
            $(note).fadeOut();
            evt.stopPropagation();
        }
    });
}
