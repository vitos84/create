/* eslint-disable no-undef */

//add form
$(function() {
 var comentForm;
 var parentId;

function form(isNew,coment){ 
    if(comentForm){
    comentForm.remove();
}
parentId=null;
 comentForm=$('.coment').clone(true,true);

 if(isNew){
     comentForm.find('.cancel').hide();
     comentForm.appendTo('.coment-list');
 }else{
     const parentComent=$(coment).parent();
     parentId=parentComent.attr('id');
     $(coment).after(comentForm);
 }
 comentForm.css({display:'flex'});}

 //load
 form(true);

 $('.reply').on('click',function(){
   form(false,this)
 });

//cansel form
 $('.coment .cansel').on('click',function(e){
     e.preventDefault();
     comentForm.remove();
 });

 //publisch form
 $('.coment .send').on('click',function(e){
     e.preventDefault();

     const data={
        post:$('.coments').attr('id'), 
        body:comentForm.find('textarea').val(),
        parent:parentId
     }
     $.ajax({
        type: 'POST',
        data:  JSON.stringify(data),
        contentType: 'application/json',
        url: '/coment/add'
      }).done(data=>{
          if(!data.ok)
          { if(data.error===undefined){
            data.error='неизвестная ошибка!'   
            $(comentForm).prepend('<p class="error">' + data.error + '</p>');
           }}
         else{
             const{login,body}=data;
              const newComent=` <ul>
                  <li style="background-color:red;">
                    <div class="head">
                      <a href="/users/${login}">
                        ${login}
                      </a>
                      <spam class="date">
                        только что
                      </spam>
                    </div>
                    ${body}
                  </li>
            </ul>`;
            $(comentForm).after(newComent);
            form(true);
          }
      }); 
 })
    
});

/*eslint-enable no-undef*/ 