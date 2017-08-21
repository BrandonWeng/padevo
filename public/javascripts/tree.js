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

});

$(document).change((e) => {
  if (e.currentTarget.URL.indexOf('monster') != -1) {
    waitForImages();
  }
});



var waitForImages = () => {
  if ( $('.parent-img').length === 0 )
    setTimeout(waitForImages, 250);
  else {

    $('.evo_material').bind('cssClassChanged', (e) => {
      // console.log(e);
      var total = 0;
      $('.nested:not(.closed)').each((idx, obj) => {
        if ($(obj).children('.nested:not(.closed)').length == 0)
          total += parseInt(obj.dataset.num)
      });
      $('.material-count').html('Required box space: ' + total)
    });

    $('.parent-img').click(function(){
      $(this).siblings().toggleClass('closed');
      $('.evo_material').trigger('cssClassChanged');
    });

    $('.evo_material').trigger('cssClassChanged');
      $('[data-toggle="tooltip"]').tooltip();
  }
}
