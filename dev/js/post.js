/* eslint-disable no-undef */
$(function() {
    // eslint-disable-next-line
    var editor = new MediumEditor('#post-body', {
      placeholder: {
        text: '',
        hideOnClick: true
      }
    });
      // clear
  $('.post-form input, #post-body').on('focus', function() {
    $('.post-form p.error').remove();
    $('.post-form input, #post-body').removeClass('error');
  });
    //publisch
    $('.publisch-button').on('click',(e)=>{
        e.preventDefault();
    

        const data={
            title:$('#post-title').val(),
            body:$('#post-body').html(),
        };
        $.ajax({
            type: 'POST',
            data:  JSON.stringify(data),
            contentType: 'application/json',
            url: '/post/add'
          }).done((data)=>{
              console.log(data);
           if(!data.ok){
            $('.post-form h2').after('<p class="error">' + data.error + '</p>');
             if(data.fields){
                 data.fields.forEach((item)=>{
                    $('#post-'+item).addClass('error');
                 });
             }
           }
           else{
               //$('.registr h2').after('<p class="success">'+data.messege +'</p>')
               $(location).attr('href','/');
            }
         });
         
    });
});

/*eslint-enable no-undef*/ 