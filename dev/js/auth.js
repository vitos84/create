/*eslint-disable no-undef*/ 
$(function() {
    //toogle 
    let flag=true;
    $('.switch-button').on('click',(e)=>{
        e.preventDefault();

        if(flag){
            flag=false;
            $('.login').hide();
            $('.registr').show('slow');
          
        }
        else{
            flag=true;
            $('.login').show('slow');
            $('.registr').hide(); 
        }
        $('form.login p.error, form.registr p.error').remove();
        $('form.login input, form.registr input').removeClass('error');
    });
      
   // clear
  $('form.login input, form.registr input').on('focus', function() {
    $('form.login p.error, form.registr p.error').remove();
    $('form.login input, form.registr input').removeClass('error');
  });
    //registr
   $('.registr-button').on('click',(e)=>{
    e.preventDefault();
    $('form.login p.error, form.registr p.error').remove();
    $('form.login input, form.registr input').removeClass('error');
    const data={
        login:$('#login-registr').val(),
        password:$('#password-registr').val(),
        passwordConfirm:$('#password-registr-confirm').val()
    }
    console.log(data);
    $.ajax({
        type: 'POST',
        data:  JSON.stringify(data),
        contentType: 'application/json',
        url: '/api/auth/registr'
      }).done((data)=>{
       if(!data.ok){
        $('.registr h2').after('<p class="error">' + data.error + '</p>');
         if(data.fields){
             data.fields.forEach((item)=>{
                $('input[name='+item+']').addClass('error');
             });
         }
       }
       else{
           //$('.registr h2').after('<p class="success">'+data.messege +'</p>')
           $(location).attr('href','/');
        }
     });
       //clear
       $('input').on('focus',()=>{
        $('p.error').remove();
        $('input.error').removeClass('error');
    });
});
   //Post in login
   $('.login-button').on('click',(e)=>{
    e.preventDefault();
    $('form.login p.error, form.registr p.error').remove();
    $('form.login input, form.registr input').removeClass('error');
    const data={
        login:$('#login-login').val(),
        password:$('#login-password').val(),
    }
    console.log(data);
    $.ajax({
        type: 'POST',
        data:  JSON.stringify(data),
        contentType: 'application/json',
        url: '/api/auth/login'
      }).done((data)=>{
          console.log(data);
       if(!data.ok){
        $('.login h2').after('<p class="error">' + data.error + '</p>');
         if(data.fields){
             data.fields.forEach((item)=>{
                $('input[name='+item+']').addClass('error');
             });
         }
       }
       else
       //{ $('.login h2').after('<p class="success">'+data.messege +'</p>')}
       $(location).attr('href','/');

     });
});
});



/*eslint-enable no-undef*/ 