<?php echo $header; ?>
<div id="fb-root"></div>
<script>(function(d, s, id) {
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) return;
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/ru_RU/all.js#xfbml=1";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
<script type="text/javascript" src="http://cdn.sublimevideo.net/js/3zkej3us.js"></script>
<div id="content"><?php echo $content_top; ?>
<h1 style="display: none;"><?php echo $heading_title; ?></h1>
<ul>
<li>Вы хотите провести яркую, одухотворенную, здоровую беременность и подготовиться к
родам? Сделать все возможное, что есть в Ваших силах, чтобы роды прошли наиболее
благоприятно для Вас и Вашего малыша?
<p><i>Описать пролемы, возникающие во время беременности и родов
Беременность часто сопровождается такими неприятными проблемами как:</i></p></li>
<li>Но как подготавливать свой организм, свое тело и психику в такой удивительный период
беременности и к такому важному событию как роды?</li>
<li>Решение есть!<br/>
<i>Информация о полезности його-практики<br/>
Отличия и преимущества йоги перед гимнастикой</i></li>
<li>Добро пожаловать на оздоровительный духовно-медицинский проект "LifeYogaClub". Меня
зовут Елена Сыроежина и я представляю свой новый видео-курс по йоге для беременных с
подробным описанием техник физической подготовки, дыхательных упражнений и техники
по релаксации, вводный урок которого Вы можете получить СОВЕРШЕННО БЕСПЛАТНО,
чтобы убедиться в его потресающей нежности, качественной неторопливой подаче
материала и начать занятия уже сейчас...</li>
</ul>
<div class="video_wrap">
<!-- http://docs.sublimevideo.net/write-proper-video-elements -->
<video id="myVideo" class="sublime" width="640" height="360" poster="http://d1p69vb2iuddhr.cloudfront.net/assets/www/demo/midnight_sun_800-e460322294501e1d5db9ab3859dd859a.jpg" preload="none">
  <source data-quality="hd" src="http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.mp4"></source>
  <source src="http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4"></source>
  <source data-quality="hd" src="http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"></source>
  <source src="http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.webm"></source>
</video>
</div>

<div class="freshbutton-blue">
  <div class="slide-to-message">
    <div id="slide-to-mask" class="slide-to-mask"></div>
    ЗАКАЗАТЬ
  </div>
</div>
<script type="text/javascript">
  var animate = function() {
    $('#slide-to-mask').animate({
      left: '+=200'
    }, 1500, function() {
      $(this).css({left: '-300px'});
      setTimeout(animate, 2000);
    });      
  }
  $(function() {
    animate();
    if (sublimevideo.prepare) sublimevideo.prepare();
    if (typeof showBottomPanel != 'undefined' && !$.cookie('bottomPanelHide')) 
    {
        setTimeout(showBottomPanel, 1500);
    }
    if (typeof FB != 'undefined') FB.XFBML.parse(); 
  });
  
</script>


<div id="bottomPanel">
    <div id="bottomPanelConteiner">
        <a id="closeBottomPanel" class="close" href="#"></a>
        <img src="catalog/view/theme/yogamamadvd/image/bottom-panel-logo.png" id="bottomPanelLogo" />  
        <form>
            <span class="title">новые видеоуроки <span>бесплатно!</span> </span> 
            <input class="placeholder" type="text" name="email" placeholder="Ваш email" />
            <button type="submit">Подписаться</button>
        </form> 
        <div class="fb-like" data-href="http://www.facebook.com/yogamamadvdru" data-send="false" data-width="450" data-show-faces="true"></div>
        </div>
    </div>
</div>
<img id="showBottomPanel" src="catalog/view/theme/yogamamadvd/image/bottom-panel-show.png" />

<?php echo $content_bottom; ?>
<?php echo $footer; ?>