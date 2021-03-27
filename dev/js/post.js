/* eslint-disable no-undef */
$(function() {
   
  $('.post-form input, #post-body').on('focus', function() {
    $('.post-form p.error').remove();
    $('.post-form input, #post-body').removeClass('error');
  });
    //publisch
    $('.publisch-button, .save-button').on('click',function(e){
        e.preventDefault();
    console.log(this);
    const isDraft=$(this).attr('class').split(' ')[0]==='save-button';
        const data={
            title:$('#post-title').val(),
            body:$('#post-body').val(),
            isDraft:isDraft,
            postId:$('#post-id').val()
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
             // $(location).attr('href','/');
             console.log(isDraft);
             if (isDraft) {
              $(location).attr('href', '/post/edit/' + data.post.id);
            } else {
              $(location).attr('href', '/posts/' + data.post.url);
            }
            }
         });
         
    });
    //fileinfo
    $('#fileinfo').on('submit',function(e){
      e.preventDefault(e);

      let formData= new FormData(this);

      $.ajax({
        type:'POST',
        data:formData,
        url:'/upload/image',
        processData:false,
        contentType:false,
        success:function(r){
          console.log(r)
        },
        error:function(e){
          console.log(e)
        }
      }).done().catch();
    });
});

/*eslint-enable no-undef*/ 