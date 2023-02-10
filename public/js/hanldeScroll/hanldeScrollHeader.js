const herderEle = document.querySelector('header');

let prevScrollpos = window.pageYOffset;
// console.log(prevScrollpos)
// console.log('hello')


if(window.innerWidth > 900) {
	window.onscroll = function() {
	  var currentScrollPos = window.pageYOffset;
	  if (prevScrollpos > currentScrollPos) {
		herderEle.style.display = "flex";
	  } else {
		herderEle.style.display = "none";
	  }
	  prevScrollpos = currentScrollPos;
	}
} 

window.onresize = () => {
	if(window.innerWidth > 900) {
		window.onscroll = function() {
		  var currentScrollPos = window.pageYOffset;
		  if (prevScrollpos > currentScrollPos) {
			herderEle.style.display = "flex";
		  } else {
			herderEle.style.display = "none";
		  }
		  prevScrollpos = currentScrollPos;
		}
	} 
	console.log(innerWidth)
}
