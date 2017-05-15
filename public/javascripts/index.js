$('.evo_material').click(function(){
  $(this).toggleClass('blur');
});

$(window).on('resize',function(){
  if ($(window.innerWidth) < 768){
    $('.mat').removeClass('col-sm-1');
    $('.mat').addClass('col-xs-3')
  }
})