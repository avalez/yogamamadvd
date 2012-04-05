// http://www.scriptiny.com/2010/02/javascript-wysiwyg-editor/
// http://perplexed.co.uk/993_contenteditable_cross_browser_wysiwyg.htm
// http://nicedit.com/
// clickable links (instead of edit) - contenteditable=true on edit icon click, false on blur
TINY={};

function T$(i){return document.getElementById(i)}
function T$$$(){return document.all?1:1}

TINY.editor=function(){
  var c=[], offset=-30;
  c['cut']=[1,'Cut','a','cut',1];
  c['copy']=[2,'Copy','a','copy',1];
  c['paste']=[3,'Paste','a','paste',1];
  c['bold']=[4,'Bold','a','bold'];
  c['italic']=[5,'Italic','a','italic'];
  c['underline']=[6,'Underline','a','underline'];
  c['strikethrough']=[7,'Strikethrough','a','strikethrough'];
  c['subscript']=[8,'Subscript','a','subscript'];
  c['superscript']=[9,'Superscript','a','superscript'];
  c['orderedlist']=[10,'Insert Ordered List','a','insertorderedlist'];
  c['unorderedlist']=[11,'Insert Unordered List','a','insertunorderedlist'];
  c['outdent']=[12,'Outdent','a','outdent'];
  c['indent']=[13,'Indent','a','indent'];
  c['leftalign']=[14,'Left Align','a','justifyleft'];
  c['centeralign']=[15,'Center Align','a','justifycenter'];
  c['rightalign']=[16,'Right Align','a','justifyright'];
  c['blockjustify']=[17,'Block Justify','a','justifyfull'];
  c['undo']=[18,'Undo','a','undo'];
  c['redo']=[19,'Redo','a','redo'];
  c['image']=[20,'Insert Image','i','insertimage','Enter Image URL:','http://'];
  c['hr']=[21,'Insert Horizontal Rule','a','inserthorizontalrule'];
  c['link']=[22,'Insert Hyperlink','i','createlink','Enter URL:','http://'];
  c['unlink']=[23,'Remove Hyperlink','a','unlink'];
  c['unformat']=[24,'Remove Formatting','a','removeformat'];
  c['print']=[25,'Print','a','print'];
  c['source']=[26,'Source','d','source'];
  c['done']=[27,'Done','d','done'];
  c['delete']=[28,'Delete','d','delete'];
  function edit(n,obj){
    this.n=n; window[n]=this; this.t=obj.el; this.obj=obj; this.xhtml=obj.xhtml;
    var p=document.createElement('div'), w=document.createElement('div'), h=document.createElement('div'),
    l=obj.controls.length, i=0; 
    this.t.insertBefore(p, this.t.firstChild);
    this.i=document.createElement('textarea'); this.i.frameBorder=0;
    this.i.width=obj.width||'500'; this.i.height=obj.height||'250';
    h.width=this.t.width||'500'; h.height=this.t.height||'250';
    this.ie=T$$$();
    h.className=obj.rowclass||'teheader'; p.className=obj.cssclass||'te'; /*p.style.width=this.t.width+'px';*/p.appendChild(h);
    //p.insertBefore(h, this.t);
    this.obj.h = [h];
    for(i;i<l;i++){
      var id=obj.controls[i];
      if(id=='n'){
        h=document.createElement('div'); h.className=obj.rowclass||'teheader';p.appendChild(h)
        //p.insertBefore(h, this.t);
        this.obj.h.push(h);
      }else if(id=='|'){
        var d=document.createElement('div'); d.className=obj.dividerclass||'tedivider'; h.appendChild(d)
      }else if(id=='font'){
        var sel=document.createElement('select'), fonts=obj.fonts||['Verdana','Arial','Georgia'], fl=fonts.length, x=0;
        sel.className='tefont'; sel.onchange=new Function(this.n+'.ddaction(this,"fontname")');this.unselectable(sel);
        sel.options[0]=new Option('Font','');
        for(x;x<fl;x++){
          var font=fonts[x];
          sel.options[x+1]=new Option(font,font)
        }
        h.appendChild(sel)
      }else if(id=='size'){
        var sel=document.createElement('select'), sizes=obj.sizes||[1,2,3,4,5,6,7], sl=sizes.length, x=0;
        sel.className='tesize'; sel.onchange=new Function(this.n+'.ddaction(this,"fontsize")');this.unselectable(sel);
        for(x;x<sl;x++){
          var size=sizes[x];
          sel.options[x]=new Option(size,size)
        }
        h.appendChild(sel)
      }else if(id=='style'){
        var sel=document.createElement('select'),
        styles=obj.styles||[['Style',''],['Paragraph','<p>'],['Code Block', '<pre>'],['Code', '<code>'],['Header 1','<h1>'],['Header 2','<h2>'],['Header 3','<h3>'],['Header 4','<h4>'],['Header 5','<h5>'],['Header 6','<h6>']],
        sl=styles.length, x=0;
        sel.className='testyle'; sel.onchange=new Function(this.n+'.ddaction(this,"formatblock")');this.unselectable(sel);
        for(x;x<sl;x++){
          var style=styles[x];
          sel.options[x]=new Option(style[0],style[1])
        }
        h.appendChild(sel)
      }else if(c[id]){
        var div=document.createElement('div'), x=c[id], func=x[2], ex, pos=x[0]*offset;
        div.className=obj.controlclass||'tecontrol';
        div.style.backgroundPosition='0px '+pos+'px';
        div.title=x[1];
        ex=func=='a'?'.action("'+x[3]+'",0,'+(x[4]||0)+')':func=='i'?'.insert("'+x[4]+'","'+x[5]+'","'+x[3]+'")':'.direct("'+x[3]+'")';
        div.onclick=new Function('if(!'+this.n +'.t)return;'+this.n+(id=='print'?'.print()':(id=='source'?'.toggle(0,this)':ex)));
        div.onmouseover=new Function(this.n+'.hover(this,'+pos+',1)');
        div.onmouseout=new Function(this.n+'.hover(this,'+pos+',0)');
        this.unselectable(div);
        h.appendChild(div);
        if(this.ie){div.unselectable='on'}
      }
    }
    //this.t.parentNode.insertBefore(p,this.t); this.t.style.width=this.i.width+'px';
    //w.appendChild(this.t); w.appendChild(this.i);
    // p.appendChild(w); //this.t.style.display='none';
    if(obj.footer){
      var f=document.createElement('div'); f.className=obj.footerclass||'tefooter';
      if(obj.toggle){
        var to=obj.toggle, ts=document.createElement('div');
        ts.className=to.cssclass||'toggle'; ts.innerHTML=obj.toggletext||'source';
        ts.onclick=new Function(this.n+'.toggle(0,this);return false');
        f.appendChild(ts)
      }
      if(obj.resize){
        var ro=obj.resize, rs=document.createElement('div'); rs.className=ro.cssclass||'resize';
        rs.onmousedown=new Function('event',this.n+'.resize(event);return false');
        rs.onselectstart=function(){return false};
        f.appendChild(rs)
      }
      p.appendChild(f)
    }
    this.e=window.document;//this.i.contentWindow.document; this.e.open();
    //var m='<html><head>', bodyid=obj.bodyid?" id=\""+obj.bodyid+"\"":"";
    //if(obj.cssfile){m+='<link rel="stylesheet" href="'+obj.cssfile+'" />'}
    //if(obj.css){m+='<style type="text/css">'+obj.css+'</style>'}
    //m+='</head><body'+bodyid+'>'+(obj.content||this.t.value);
    //m+='</body></html>';
    //this.e.write(m);
    //this.e.close();
    //this.e.designMode='on';
    this.d=1;
    if(this.xhtml){
      try{this.e.execCommand("styleWithCSS",0,0)}
      catch(e){try{this.e.execCommand("useCSS",0,1)}catch(e){}}
    }
    this.obj['source']=this.toggle;
    this.t=null;
  };
  edit.prototype.print=function(){
    this.i.contentWindow.print()
  },
  edit.prototype.hover=function(div,pos,dir){
    div.style.backgroundPosition=(dir?'34px ':'0px ')+(pos)+'px'
  },
  edit.prototype.ddaction=function(dd,a){
    var i=dd.selectedIndex, v=dd.options[i].value;
    this.action(a,v)
  },
  edit.prototype.action=function(cmd,val,ie){
    if(ie&&!this.ie){
      alert('Your browser does not support this function.')
    }else{
      if (cmd == 'formatblock' && val == '<code>') {
        this.replaceSelection(function(s) {
          var el = document.createElement('code');
          el.appendChild(document.createTextNode(s));
          return el;
        })
      } else {
        this.e.execCommand(cmd,0,val||null)
      }
    }
  },
  edit.prototype.insert=function(pro,msg,cmd){
    this.t.preventblur = true;
    var val=prompt(pro,msg);
    if(val!=null&&val!=''){this.e.execCommand(cmd,0,val)}
    this.t.preventblur = false;
  },
  edit.prototype.setfont=function(){
    execCommand('formatblock',0,hType)
  },
  edit.prototype.resize=function(e){
    if(this.mv){this.freeze()}
    this.i.bcs=TINY.cursor.top(e);
    this.mv=new Function('event',this.n+'.move(event)');
    this.sr=new Function(this.n+'.freeze()');
    if(this.ie){
      document.attachEvent('onmousemove',this.mv); document.attachEvent('onmouseup',this.sr)
    }else{
      document.addEventListener('mousemove',this.mv,1); document.addEventListener('mouseup',this.sr,1)
    }
  },
  edit.prototype.move=function(e){
    var pos=TINY.cursor.top(e);
    this.i.height=parseInt(this.i.height)+pos-this.i.bcs;
    this.i.bcs=pos
  },
  edit.prototype.freeze=function(){
    if(this.ie){
      document.detachEvent('onmousemove',this.mv); document.detachEvent('onmouseup',this.sr)
    }else{
      document.removeEventListener('mousemove',this.mv,1); document.removeEventListener('mouseup',this.sr,1)
    }
  },
  edit.prototype.toggle=function(post,div){
    if(!this.d){
      var v=this.i.value;
      if(div){div.title=this.obj.toggletext||'source'}
      if(this.xhtml&&!this.ie){
        v=v.replace(/<strong>(.*)<\/strong>/gi,'<span style="font-weight: bold;">$1</span>');
        v=v.replace(/<em>(.*)<\/em>/gi,'<span style="font-weight: italic;">$1</span>')
      }
      this.t.innerHTML=v;
      this.i.style.display='none'; this.t.style.display='block'; this.d=1;
      this.t.parentNode.removeChild(this.i);
      this.t.focus();
    }else{
      var v=this.t.innerHTML;
      if(this.xhtml){
        v=v.replace(/<span class="apple-style-span">(.*)<\/span>/gi,'$1');
        v=v.replace(/ class="apple-style-span"/gi,'');
        v=v.replace(/<span style="">/gi,'');
        v=v.replace(/<br>/gi,'<br />');
        v=v.replace(/<br ?\/?>$/gi,'');
        v=v.replace(/^<br ?\/?>/gi,'');
        v=v.replace(/(<img [^>]+[^\/])>/gi,'$1 />');
        v=v.replace(/<b\b[^>]*>(.*?)<\/b[^>]*>/gi,'<strong>$1</strong>');
        v=v.replace(/<i\b[^>]*>(.*?)<\/i[^>]*>/gi,'<em>$1</em>');
        v=v.replace(/<u\b[^>]*>(.*?)<\/u[^>]*>/gi,'<span style="text-decoration:underline">$1</span>');
        v=v.replace(/<(b|strong|em|i|u) style="font-weight: normal;?">(.*)<\/(b|strong|em|i|u)>/gi,'$2');
        v=v.replace(/<(b|strong|em|i|u) style="(.*)">(.*)<\/(b|strong|em|i|u)>/gi,'<span style="$2"><$4>$3</$4></span>');
        v=v.replace(/<span style="font-weight: normal;?">(.*)<\/span>/gi,'$1');
        v=v.replace(/<span style="font-weight: bold;?">(.*)<\/span>/gi,'<strong>$1</strong>');
        v=v.replace(/<span style="font-style: italic;?">(.*)<\/span>/gi,'<em>$1</em>');
        v=v.replace(/<span style="font-weight: bold;?">(.*)<\/span>|<b\b[^>]*>(.*?)<\/b[^>]*>/gi,'<strong>$1</strong>')
      }
      if(div){div.title=this.obj.toggletext||'wysiwyg'}
      this.i.value=v;
      if(!post){
        this.i.style.height=this.t.offsetHeight+'px';
        this.i.style.width=(this.t.offsetWidth - 40)+'px';
        this.t.style.display='none'; this.i.style.display='block'; this.d=0;
        this.t.parentNode.insertBefore(this.i,this.t);
      }
    }
  },
  edit.prototype.post=function(){
    if(this.d){this.toggle(1)}
  };
  edit.prototype.direct=function(cmd){
    if (typeof this.obj[cmd] == 'function') this.obj[cmd](this.t);
  };
  edit.prototype.destroy=function(){
    this.t.parentNode.className='';
    var e = document.getElementsByTagName('DIV');
    for (i in this.obj.h) {
      this.t.parentNode.removeChild(this.obj.h[i]);
    }
  };
  edit.prototype.enable=function(element) {
    if(element){this.t=element;this.t.contentEditable='true';this.t.focus()}
    else{this.t.contentEditable='false';this.t.blur();this.t=null}
  };
  edit.prototype.unselectable=function(el) {
    // contenteditable and non button elements
    // http://stackoverflow.com/questions/1479784/contenteditable-and-non-button-elements
    el.unselectable='on'; // prevents selection in MSIE
    el.onmousedown=new Function('e', 'e.preventDefault()'); // prevents selection in all but MSIE        
  };
  edit.prototype.replaceSelection=function(t) {
    if (typeof t === 'function') {
      t = t(window.getSelection().toString());
    } else {
      t = document.createTextNode(t);
    }
    var range = window.getSelection().getRangeAt(0);
    range.deleteContents();

   range.insertNode(t);
  };
  return{edit:edit}
}();

TINY.cursor=function(){
  return{
    top:function(e){
      return T$$$()?window.event.clientY+document.documentElement.scrollTop+document.body.scrollTop:e.clientY+window.scrollY
    }
  }
}();
