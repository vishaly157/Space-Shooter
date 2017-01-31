
$(document).ready(function(){
    $("#content").css("margin-top", $("#mynav").height());
    $("#mynav").hover(function(){
        $("#mynav").toggleClass("navbar-default");
        $("#mynav").toggleClass("navbar-inverse");
    },function(){
        $("#mynav").toggleClass("navbar-default");
        $("#mynav").toggleClass("navbar-inverse");
    });   
    
    $("li").click(function(){
        $("#mynav").animate({opacity: '0'},"slow").removeClass("navbar-fixed-top");
        $("#content").animate({opacity: '0'},"slow").removeClass("container-fluid");
    });
});
