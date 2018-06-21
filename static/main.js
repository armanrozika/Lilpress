

//this is to get inside the div
let inputDraft = document.getElementById('input-draft');
document.getElementById('draft').addEventListener('click', function(){
   inputDraft.value = true;
});



var oDoc, sDefTxt;
var intLink = document.querySelectorAll('.intLink');
var imgUpload = document.querySelectorAll('.img-upload');
let populate = document.getElementById('input-populate');

function makeInput(){
   let newInput = document.createElement('input');
   //newInput.innerHTML = "rest";
   newInput.type = 'file';
   newInput.name = 'myImage';
   newInput.classList.add('imgs-upload');
   newInput.value = "";
   populate.appendChild(newInput);
   let imgsUpload = document.querySelectorAll('.imgs-upload');
   if(imgsUpload.length > 1){
      for(var j=0 ; j<imgsUpload.length-1; j++){
         imgsUpload[j].style.display = 'none';
      }
   }
   //console.log(imgsUpload.length);
   for (var i = 0; i < imgsUpload.length; i++) {
      imgsUpload[i].addEventListener('change', function(){
         var filesSelected = this.files;
          if (filesSelected.length > 0)
          {
             var fileToLoad = filesSelected[0];
              if (fileToLoad.type.match("image.*")){
                  var fileReader = new FileReader();
                  fileReader.onload = function(fileLoadedEvent)
                  {
                      let imgsrc = fileLoadedEvent.target.result
                       document.execCommand('insertHTML', false, `<img class="img" src="${imgsrc}">`);
                  };
                  fileReader.readAsDataURL(fileToLoad);
              }
          }

      });

   }

   newInput.addEventListener('change', makeInput);
}

makeInput();


// for (var i = 0; i < imgUpload.length; i++) {
//    imgUpload[i].addEventListener('change', function(){
//       makeInput();
//       var filesSelected = this.files;
//        if (filesSelected.length > 0)
//        {
//           var fileToLoad = filesSelected[0];
//            if (fileToLoad.type.match("image.*")){
//                var fileReader = new FileReader();
//                fileReader.onload = function(fileLoadedEvent)
//                {
//                    let imgsrc = fileLoadedEvent.target.result
//                     document.execCommand('insertHTML', false, `<img class="img" src="${imgsrc}">`);
//                };
//                fileReader.readAsDataURL(fileToLoad);
//            }
//        }
//
//    });
//
// }




// imgUpload.addEventListener('change', function(){
//    var filesSelected = document.getElementById("img-upload").files;
//    console.log(filesSelected);
//    data.append('myImage', filesSelected[0]);
//    console.log(data.getAll('myImage'));
//     if (filesSelected.length > 0)
//     {
//        var fileToLoad = filesSelected[0];
//         if (fileToLoad.type.match("image.*")){
//             var fileReader = new FileReader();
//             fileReader.onload = function(fileLoadedEvent)
//             {
//                 let imgsrc = fileLoadedEvent.target.result
//                  document.execCommand('insertHTML', false, `<img class="img" src="${imgsrc}">`);
//             };
//             fileReader.readAsDataURL(fileToLoad);
//         }
//     }
//
// });

for (var i = 0; i < intLink.length; i++) {
   intLink[i].addEventListener('click', makeActive);
}

var outcom = document.getElementById("textBox");

outcom.addEventListener('click', function(){
   for (var i = 0; i < intLink.length; i++) {
      var z = document.queryCommandState(intLink[i].title);
      if(!z){
         intLink[i].classList.remove("active");
      }
   }
});


outcom.addEventListener('keydown', function(){
   for (var i = 0; i < intLink.length; i++) {
      var z = document.queryCommandState(intLink[i].title);
      if(!z){
         intLink[i].classList.remove("active");
      }
   }
});

function changeSrc(){
   let getimg  = document.querySelectorAll('.img');
  //imgUpload.files = data.getAll('myImage');
  //alert(123);
   for (var i = 0; i<getimg.length; i++) {
     getimg[i].src = '/img/test.com';
   }
}

function initDoc() {
  oDoc = document.getElementById("textBox");
  sDefTxt = oDoc.innerHTML;
  document.compForm.myDoc.value = sDefTxt;
}

function makeActive(){
   var n = document.queryCommandState(this.title);
   if(n){
     this.classList.add("active");
  }
  else{
     this.classList.remove("active");
  }
  console.log(n);
}


function formatDoc(sCmd, sValue, clases) {
    document.execCommand(sCmd, false, sValue);
    document.execCommand("defaultParagraphSeparator", false, "p");
    oDoc.focus();
}

//preview the post
// let titlePrev = document.getElementById('title-prev');
//
// titlePrev.innerText = "this is article";

// prev.addEventListener('click', function(e){
//    e.preventDefault();
//    prev.style.pointerEvents = 'none';
// })
