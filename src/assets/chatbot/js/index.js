jQuery(document).ready(function ($) {


    // $('#In2CB_chaticon').click(function(){
    //     $('#In2CB_chatdiv').toggle();
    //     })


  $('#checkbox').change(function(){
    setInterval(function () {
        moveRight();
    }, 3000);
  });
  
	var slideCount = $('#In2CB_slider ul li').length;
	var slideWidth = $('#In2CB_slider ul li').width();
	var slideHeight = $('#In2CB_slider ul li').height();
	var sliderUlWidth = slideCount * slideWidth;
	
	$('#In2CB_slider').css({ width: slideWidth, height: slideHeight });
	
	$('#In2CB_slider ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });
	
    $('#In2CB_slider ul li:last-child').prependTo('#In2CB_slider ul');

    // function moveLeft() {
    //     $('#slider ul').animate({
    //         left: + slideWidth
    //     }, 200, function () {
    //         $('#slider ul li:last-child').prependTo('#slider ul');
    //         $('#slider ul').css('left', '');
    //     });
    // };

    // function moveRight() {
    //     $('#slider ul').animate({
    //         left: - slideWidth
    //     }, 200, function () {
    //         $('#slider ul li:first-child').appendTo('#slider ul');
    //         $('#slider ul').css('left', '');
    //     });
    // };

    // $('a.control_prev').click(function () {
    //     moveLeft();
    // });

    // $('a.control_next').click(function () {
    //     moveRight();
    // });

});