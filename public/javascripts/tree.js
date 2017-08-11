$('.parent-img').click(function(){
  $(this).siblings().toggleClass('closed');
});

var collapseAll = () => {
  $('.parent-img').siblings().addClass('closed');
}

var showAll = () => {
  $('.parent-img').siblings().removeClass('closed');
}
