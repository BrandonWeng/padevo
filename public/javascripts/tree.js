

var collapseAll = () => {
  $('.parent-img').siblings().addClass('closed');
  $('.evo_material').trigger('cssClassChanged');
}

var showAll = () => {
  $('.parent-img').siblings().removeClass('closed');
  $('.evo_material').trigger('cssClassChanged');
}
$(document).ready(() => {

  $(".monster-dropdown").select2({ width: 'resolve' });

  $(window).on('hashchange', function(e){
// waitForImages();
// console.log(e.originalEvent);
});
  // waitForImages();
  // console.log(  $('.parent-img'));
})
$(document).change((e) => {
  if (e.currentTarget.URL.indexOf('monster') != -1) {
    waitForImages();
  }
  // console.log(e.currentTarget.URL.indexOf('monster'));
});



var waitForImages = () => {
  if ( $('.parent-img').length === 0 )
    setTimeout(waitForImages, 250);
  else {

    $('.evo_material').bind('cssClassChanged', (e) => {
      // console.log(e);
      $('.material-count').html('Required box space: ' + $('.nested:not(.closed)').length)
    });

    $('.parent-img').click(function(){
      $(this).siblings().toggleClass('closed');
      $('.evo_material').trigger('cssClassChanged');
    });
    
    $('.evo_material').trigger('cssClassChanged');
  }
}
