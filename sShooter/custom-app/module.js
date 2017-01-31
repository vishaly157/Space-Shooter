/* 
    Created on : Aug 3, 2016, 12:20:01 PM
    Author     : vyadav
*/
       
var HomeCan = {
    controllerAs: 'balls',
    controller: function($interval){
        var canvas,ctx,width,height,
                xGravity,yGravity,friction,dots,palettes,colorCount,
                framecount,mx,my,PI,TWOPI,
                ex=300,ey=300;
        function rand( min, max ) {
            return Math.random() * ( max - min ) + min;
        }

        function randInt( min, max ) {
            return Math.floor( min + Math.random() * ( max - min + 1 ) );
        };
        
        function exhaust(){
            window.alert("exhaust");
        }
        
        function init() {
            canvas = document.getElementById( 'ballcanvas' );
            ctx = canvas.getContext( '2d' );
            xGravity = 0;
            yGravity = 1;
            friction = 0.99;
            dots = [];
            palettes = [
                "#E8E8E8",
                "#"+randInt(0,255).toString(16)+randInt(0,255).toString(16)+randInt(0,255).toString(16),
                "#"+randInt(0,255).toString(16)+randInt(0,255).toString(16)+randInt(0,255).toString(16),
                "#"+randInt(0,255).toString(16)+randInt(0,255).toString(16)+randInt(0,255).toString(16),
                "#"+randInt(0,255).toString(16)+randInt(0,255).toString(16)+randInt(0,255).toString(16),
                "#"+randInt(0,255).toString(16)+randInt(0,255).toString(16)+randInt(0,255).toString(16),
                "#"+randInt(0,255).toString(16)+randInt(0,255).toString(16)+randInt(0,255).toString(16),
                "#"+randInt(0,255).toString(16)+randInt(0,255).toString(16)+randInt(0,255).toString(16),
                "#"+randInt(0,255).toString(16)+randInt(0,255).toString(16)+randInt(0,255).toString(16),
                "#"+randInt(0,255).toString(16)+randInt(0,255).toString(16)+randInt(0,255).toString(16),
                "#"+randInt(0,255).toString(16)+randInt(0,255).toString(16)+randInt(0,255).toString(16),
                "#"+randInt(0,255).toString(16)+randInt(0,255).toString(16)+randInt(0,255).toString(16)
            ];	
            colorCount = palettes.length;
            PI = Math.PI;
            TWOPI = PI * 2;
            reset();
        }
        
        function reset() {
            width = window.innerWidth-50;
            height = window.innerHeight-100;
            dots.length = 0;
            framecount = 0;
            mx = width / 2;
            my = height / 2;
            canvas.width = width;
            canvas.height = height;
        }
                
        function create() {
            if( framecount%3===0 && dots.length < 400 ) {
                dots.push({x:10,y:100,vx:rand(0,2),vy:rand(-2,2),radius:rand(7,15),color:randInt(1,colorCount-1)});	
                dots.push({x:width-10,y:100,vx:rand(-2,2),vy:rand(-2,2),radius:rand(7,15),color:randInt(1,colorCount-1)});
                dots.push({x:width/2,y:100,vx:rand(-2,0),vy:rand(-2,2),radius:rand(7,15),color:randInt(1,colorCount-1)});
            }
        }

        function step() {             
            dots.forEach(function (dot){	
                dot.x += dot.vx;
                dot.y += dot.vy;
                // handle bounce	
                if( dot.vx > 0 && dot.x + dot.radius >= width ) {
                    dot.vx *= -0.6;
                }
                if( dot.vx < 0 && dot.x - dot.radius <= 0 ) {
                    dot.vx *= -0.6;
                }
                if( dot.vy > 0 && dot.y + dot.radius >= height ) {
                    dot.vy *= -0.6;
                }
                if( dot.vy < 0 && dot.y - dot.radius <= 0 ) {
                    dot.vy *= -0.6;
                }
                // handle bounds	
                if( dot.x + dot.radius > width ) {  //right
                    dot.x = width - dot.radius;
                    dot.vy *= friction;
                }
                if( dot.x - dot.radius < 0 ) {      //left
                    dot.x = dot.radius;
                    dot.vy *= friction;
                }
                if( dot.y + dot.radius > height ) {     //bottom
                    dot.y = height - dot.radius;
                    dot.vx *= friction;
                }
                if( dot.y - dot.radius < 0 ) {          //top
                    dot.y = dot.radius;
                    dot.vx *= friction;
                }
                dot.vx += xGravity;
                dot.vy += yGravity;
            });
                
            dots.forEach(function(dot){
                var j = dots.indexOf(dot);
                if(j>0){
                    while(j--){
                        var otherDot = dots[j]; 
                        var dx = otherDot.x - dot.x,
                        dy = otherDot.y - dot.y,
                        dist = Math.sqrt( dx * dx + dy * dy ),
                        minDist = dot.radius + otherDot.radius;
                        if( dist < minDist ) {
                            var tx = dot.x + dx / dist * minDist,
                            ty = dot.y + dy / dist * minDist,
                            ax = ( tx - otherDot.x ) * 0.6,
                            ay = ( ty - otherDot.y ) * 0.6;
                            dot.vx -= ax;
                            dot.vy -= ay;      
                            otherDot.vx += ax;
                            otherDot.vy += ay;
                            dot.vx *= friction * 0.9;
                            dot.vy *= friction * 0.9;
                            otherDot.vx *= friction * 0.9;
                            otherDot.vy *= friction * 0.9;
                        }
                    }
                }
            });
        }

        function draw() {
            //background
            ctx.fillStyle = palettes[ 0 ];
            ctx.fillRect( 0, 0, width, height );
            //design
            ctx.fillStyle = palettes[1];
            //ctx.beginPath();
            //ctx.arc(ex,ey,50,0,TWOPI);
            //ctx.fill();
            //balls
            dots.forEach(function(dot){
                ctx.beginPath();
                ctx.arc( dot.x, dot.y, dot.radius, 0, TWOPI );
                ctx.fillStyle = palettes[ dot.color ];
                ctx.fill();
            });
        }
        
        $interval(function(){
            create();
            step();
            draw();
            framecount++;
        },1000/60);

        function onmousemove( e ) {
            mx = e.pageX;
            my = e.pageY;
            xGravity = ( mx - width / 2 ) / ( width / 2 );
            yGravity = ( my - height / 2 ) / ( height / 2 );            
            console.log("X: "+xGravity+"\tY: "+yGravity);
        }

        window.addEventListener( 'resize', reset );
        window.addEventListener( 'mousemove', onmousemove );
        init();
    },
    templateUrl: ['custom-app/HomeCan.html'].join('')
};
        
var InApp = {
    controllerAs: 'inapp',
    controller: function ($interval){
        var i=this;
        i.hght=550;
        i.wdth=1175;
        i.msg="Space Shooter";
        i.play=false;
        i.mcanvas = document.getElementById("workspace");
        i.ctx = i.mcanvas.getContext("2d");
        i.framecount=0;
        i.enemies =  new Array();
        i.player = {posX:0,posY:0,hlth:15,wdt:170,hgt:120,firedelay:30,pX:0,pY:0};
        i.playershots = new Array();
        i.mplayershots = new Array();
        i.eimage = new Image();
        i.eimage.src = "Images/explosion.png";
        i.playerim = new Image();
        i.playerim.src = "Images/ship.png";
        i.bckgnd = new Image();
        i.bckgnd.src = "Images/Space.jpg";
        i.ene = new Image();
        i.ene.src = "Images/enm.png";
        i.bckprop = {bX:0,bY:0,bwdt:2300,bhgt:1080,dbX:0,dbY:0};
        i.allexplosions = new Array();
        i.scre=0;
        i.spd=2;
        i.level="Easy";
        i.erate=50;
        i.ehl=2;
        
        $interval(function(){
            
            if(i.play)
                i.draw();
        },1000/60);
        
        i.stat = function ($event){
            if($event){
                i.player.posX=$event.pageX-i.player.wdt;
                i.player.posY=$event.pageY-i.player.hgt;
                i.play=true;
            }
            else{
                i.play=false;
                i.framecount=0;
            }
        };
                
        i.close = function() {
            i.player = {posX:0,posY:0,hlth:10,wdt:170,hgt:120,firedelay:20,pX:0,pY:0};
            i.enemies = [];
            i.playershots = [];
            i.mplayershots = [];
            i.allexplosions = [];
            i.level="Easy";
            i.play=false;
            i.framecount=0;
            alert("Game Over... \n Your Score:"+i.scre);
            i.scre=0;
            document.getElementById('INAPP').style.display='none';
            $("#mynav").animate({opacity: '1'},"slow").addClass("navbar-fixed-top");
            $("#content").animate({opacity: '1'},"slow").addClass("container-fluid");
            i.player.posX=0;
            i.player.posY=0;
        };
        
        i.draw = function(){
        if(i.scre<15){i.level="Easy";}
        else if(i.scre<30){i.level="Medium";}
        else if(i.scre<=50){i.level="Hard";}
        else if(i.scre>50){i.level="Insane";}
            switch(i.level){
                case "Easy":
                    i.player.firedelay=30;
                    i.spd=2;
                    i.ehl=2;
                    i.erate=50;
                    break;
                case "Medium":
                    i.player.firedelay=25;
                    i.spd=3;
                    i.ehl=5;
                    i.erate=50;
                    break;
                case "Hard":
                    i.player.firedelay=15;
                    i.spd=4;
                    i.ehl=10;
                    i.erate=40;
                    break;
                case "Insane":
                    i.player.firedelay=5;
                    i.spd=5;
                    i.ehl=15;
                    i.erate=20;
                    break;
            }
            i.msg="[Space Shooter] [Health:"+i.player.hlth+
                    "] [FireRate:"+Math.floor((40-i.player.firedelay)/40*100)+
                    "] [Score:"+i.scre+"] [level:"+i.level+"]";
            i.ctx.drawImage(i.bckgnd,i.bckprop.bX,i.bckprop.bY,i.bckprop.bwdt,i.bckprop.bhgt,i.bckprop.dbX,i.bckprop.dbY,i.mcanvas.scrollWidth,i.mcanvas.scrollHeight);
                if(i.framecount%3===0){
                    i.bckprop.bX+=5;
                }
                if(i.bckprop.bX+i.bckprop.bwdt===7620){
                    i.bckprop.bX=0;
                }
            i.ctx.font = "30px Comic Sans MS";
            i.ctx.fillStyle = "#FFFFFF";
            i.ctx.fillText(i.msg, 120, 30);
            i.ctx.drawImage(i.playerim,i.player.pX,i.player.pY,667,539,i.player.posX,i.player.posY,i.player.wdt,i.player.hgt);
                if(i.framecount%3===0){
                    i.player.pX+=666;
                }
                if(i.player.pX===3996){
                    i.player.pX=0;
                }
            i.ctx.fillStyle = "#8A1919";
            i.ctx.fillRect(i.player.posX,i.player.posY+5+i.player.hgt,i.player.wdt*(i.player.hlth/15),3);
            i.framecount += 1;
            
            if(i.framecount%i.player.firedelay===0){
                i.playershots.push({
                    sX:i.player.posX+i.player.wdt,
                    sY:i.player.posY+i.player.hgt/2,
                    swdt:15,
                    shgt:5,
                    sdam:1});
            }
            if(i.framecount%(i.player.firedelay*4)===0){
                i.mplayershots.push({
                    mX:i.player.posX+i.player.wdt,
                    mY:i.player.posY+i.player.hgt*0.7,
                    mwdt:25,
                    mhgt:10,
                    mdam:2,
                    goup:true});
                i.mplayershots.push({
                    mX:i.player.posX+i.player.wdt,
                    mY:i.player.posY+i.player.hgt*0.3,
                    mwdt:25,
                    mhgt:10,
                    mdam:2,
                    goup:false});
            }
            i.playershots.forEach(function(ps){
                i.ctx.fillStyle = "#E39E00";
                i.ctx.fillRect(ps.sX,ps.sY,ps.swdt,ps.shgt);
                ps.sX+=15;
            });
            i.mplayershots.forEach(function(psm){
                i.ctx.fillStyle = "#27E917";
                i.ctx.fillRect(psm.mX,psm.mY,psm.mwdt,psm.mhgt);
                psm.mX+=7;
                if(i.framecount%10===0){
                    if(psm.goup){
                        psm.mY +=1;
                    }else{
                        psm.mY -=1;
                    }
                }
            });
            if(i.framecount%i.erate===0){
                var x=Math.floor(Math.random()*5+i.ehl);
                i.enemies.push({
                    sx:0,
                    sy:0,
                    ptX:1200 ,
                    ptY:Math.random()*475 ,
                    hlth:x,
                    mhlth:x,
                    wdt:100,
                    hgt:100});
            }
            i.enemies.forEach(function(en){
//                i.ctx.fillStyle = "#E56816";
//                i.ctx.fillRect(en.ptX,en.ptY,en.wdt,en.hgt);
                i.ctx.fillStyle = "#8A1919";
                i.ctx.fillRect(en.ptX,en.ptY+5+en.hgt,en.wdt*(en.hlth/en.mhlth),3);
                i.ctx.drawImage(i.ene,en.sx,en.sy,62,62,en.ptX,en.ptY,en.wdt,en.hgt);
                if(i.framecount%3===0){
                    en.sx+=62.5;
                }
                if(en.sx>=3937){
                    en.sx=0;
                }
                en.ptX-=i.spd;
            });
            i.collison();
            
            i.allexplosions.forEach(function (ex){
                i.ctx.drawImage(ex.img,ex.sX,ex.sY,ex.srcwdt,ex.srchgt,ex.dX,ex.dY,ex.dstwdt,ex.dsthgt);
                if(i.framecount%3===0){
                    ex.sX+=96;
                }
                if(ex.sX===1632){
                   var x = i.allexplosions.indexOf(ex);
                   delete i.allexplosions[x];
                }
            });
            
            if(i.player.hlth<0){
                i.close();
            }
        };
        
        i.collison = function(){
            i.enemies.forEach(function(enemy){
                i.playershots.forEach(function(shot){
                    if(shot.sX>1200){
                        var x = i.playershots.indexOf(shot);
                        delete i.playershots[x];
                    }
                    if(shot.sY>enemy.ptY && shot.sY<(enemy.ptY+enemy.hgt) 
                            && shot.sX>enemy.ptX && shot.sX<(enemy.ptX+enemy.wdt)){
                        enemy.hlth-=shot.sdam;
                        var x = i.playershots.indexOf(shot);
                        delete i.playershots[x];
                    }
                });
                i.mplayershots.forEach(function(missile){
                    if(missile.sX>1200 | missile.sY<0 | missile.sY>550){
                        var x = i.mplayershots.indexOf(missile);
                        delete i.mplayershots[x];
                    }
                    if((missile.mY+missile.mhgt)>enemy.ptY && missile.mY<(enemy.ptY+enemy.hgt) 
                            && missile.mX>enemy.ptX && missile.mX<(enemy.ptX+enemy.wdt)){
                        enemy.hlth-=missile.mdam;
                        var x = i.mplayershots.indexOf(missile);
                        delete i.mplayershots[x];
                    }
                });
                if(enemy.hlth<1){
                    i.scre+=1;
                    i.allexplosions.push({img:i.eimage ,sX:0,sY:0,srcwdt:96,srchgt:96,dX:enemy.ptX,dY:enemy.ptY,dstwdt:150,dsthgt:150});
                    var x = i.enemies.indexOf(enemy);
                    delete i.enemies[x];
                }
                if(enemy.ptX+enemy.wdt<0){
                    var x = i.enemies.indexOf(enemy);
                    delete i.enemies[x];
                }
                if((i.player.posY+i.player.hgt)>enemy.ptY && i.player.posY<(enemy.ptY+enemy.hgt) 
                            && i.player.posX+i.player.wdt>enemy.ptX && i.player.posX<(enemy.ptX+enemy.wdt)){
                   i.player.hlth-=1;
                   i.allexplosions.push({img:i.eimage ,sX:0,sY:0,srcwdt:96,srchgt:96,dX:enemy.ptX,dY:enemy.ptY-enemy.hgt,dstwdt:150,dsthgt:150});
                   var x = i.enemies.indexOf(enemy);
                   delete i.enemies[x];
                }
            });
        };
        
        i.toggplay = function(){
            i.framecount=0;
            i.play = !i.play;
        };
                
        i.test = function(){
            alert("called");
        };
     
    },
    templateUrl: ['custom-app/Inapp.html'].join('')
};

var LogIn = {
    controllerAs: 'login',
    controller: function ($http){
        var login=this;
        login.info;
        login.usName;
        login.usPass;
        login.remember=false;
        login.verify = function (){
            $http({
                        method : 'GET',
                        url : 'http://localhost:8080/TestServ/ng-loginTest',
                        headers: {
                            'Access-Control-Allow-Credentials': 'true',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                            'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
                        }
                }).success(function(data, status, headers, config) {
                        login.info = data;
                        alert(""+login.info);
                }).error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        alert("error "+status);
                });

            if(login.usName && login.usPass){
                
            }
            
        };
        login.close = function(){
            $("#mynav").animate({opacity: '1'},"slow").addClass("navbar-fixed-top");
            $("#content").animate({opacity: '1'},"slow").addClass("container-fluid");
            document.getElementById('LOGIN').style.display='none';
        };
    },
    templateUrl: ['custom-app/login.html'].join('')
};
angular.module('app', []).component('logIn', LogIn).component('inApp',InApp).component('mainFr',HomeCan);