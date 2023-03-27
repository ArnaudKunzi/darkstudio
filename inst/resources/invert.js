/*
 * invert.js
 *
 * Created by Arnaud Künzi on 2023.03.27 
 *
 */

//cycles trough 0 to 1 with increments of 0.2, very harsh on the eyes when going black to white.
function invert_old(){
	
	let img = document.getElementById('img');
	console.log(img)
	console.log("yes")
	let imgattr = img.getAttribute('style');
	let val = imgattr.match("invert\\((\\d|0\.\\d+)\\)");
	if( val != null){
		newval = Number(val[1])+0.2;
		if(newval > 1){
				newval = 0;
		}
		let strrep = imgattr.replace(val[1], newval);
		img.setAttribute('style',strrep);
	} else{
		img.setAttribute('style',imgattr + 'filter: invert(1)');
	}

}




function invert_wheel(){

	let img = document.getElementById('img');
	//console.log(img)
	let imgattr = img.getAttribute('style');
	let val = imgattr.match("invert\\((\\d|0\.\\d+)\\)");
	let inv_count = img.getAttribute('inv_count');
	if( val != null){
		inv_count = Number(inv_count)+1
		newval = (Math.sin(inv_count/10)+1)/2;
		
		
		if (newval > 0.35 & newval < 0.65) {
			if (Math.cos(inv_count/10) > 0) {
				newval = 0.65
			}else{
				newval = 0.35
			}
		}
		console.log(newval)
		
		img.setAttribute('inv_count',inv_count);
		
		let strrep = imgattr.replace(val[1], newval);
		img.setAttribute('style',strrep);
	} else{
		img.setAttribute('style',imgattr + 'filter: invert(1)');
		img.setAttribute('inv_count','0');
	}

}

function invert_click(){

	let img = document.getElementById('img');
	//console.log(img)
	let imgattr = img.getAttribute('style');
	let val = imgattr.match("invert\\((\\d|0\.\\d+)\\)");
	if( val != null){
		let newval = 0
		
		if (val[1] < 0.5) {
			newval = 1
			img.setAttribute('inv_count','17');
		}else{
			img.setAttribute('inv_count','47');
		}

		let strrep = imgattr.replace(val[1], newval);
		img.setAttribute('style',strrep);
		
	} else{
		img.setAttribute('style',imgattr + 'filter: invert(1)');
		
	}

}


/*
//testing observer constructors for debugging
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    console.log(mutations, observer);
    // ...
});
*/

var inject_css = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
	console.log(mutations, observer);

	if(mutations[0].oldValue.match("invert") == null ){
		var img = mutations[0].target;
		
		//uncomment this line to  default in full dark mode at startup
		img.setAttribute('style',mutations[0].oldValue + ' filter: invert(1);')
		
		var head = img.closest('html').children[0]
		
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'js/invert.js';    

		head.appendChild(script);
		
		img.setAttribute('onwheel','invert_wheel();');
		img.setAttribute('onclick','invert_click();');
		 
	}
	
    
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback


function waitForElm(selector) {
    return new Promise(resolve => {
        if (this.document.querySelector(selector)) {
            return resolve(this.document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (this.document.querySelector(selector)) {
                resolve(this.document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(this.document.body, {
            childList: true,
            subtree: true
        });
    });
}

//The first observer/promise waits for the plot iframe to be loaded
waitForElm('#rstudio_plot_image_frame').then((elm) => {
    //console.log('#rstudio_plot_image_frame loaded')
	
	//then nested inside of it, we have a second observer within the context of the iframe (variable elm)
	//that triggers the callback function
	inject_css.observe(elm.contentWindow.document, {
	  subtree: true,
	  attributes: true,
	  attributeOldValue: true,
	  attributeFilter: ["style"]
	});
});