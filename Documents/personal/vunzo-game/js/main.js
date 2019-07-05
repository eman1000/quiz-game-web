

$(".startLoading").click(function (){

  $(".game-loading").show();
  loadingComplete();

}); 

$('.cancel-match').click( function(){
  $(".game-loading").hide();
});

function loadingComplete() {
  window.setTimeout(function(){

    // Move to a new location or you can do something else
    window.location.href = "questions.html";

}, 3000);
}