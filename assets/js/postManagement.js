window.addEventListener('load', function() {
	var userLoggedIn = document.getElementById('userLoggedIn');
	/* ************************************************************* */
	/*                             CAMERA                            */
	/* ************************************************************* */
	var body = document.getElementById('body');
	var postsContainer = document.getElementById('postsContainer');
	var alertContainer = document.getElementById('alert-container');
	var alertDelete = document.getElementById('delete');
	var alertCancel = document.getElementById('cancel');
	var body = document.getElementById('body');
	var postsContainer = document.getElementById('postsContainer');
	var next = document.getElementById('next');
	var previous = document.getElementById('previous');
	var post_id;

	var video = document.getElementById('video');
	var canvas = document.getElementById('canvas');
	var snap = document.getElementById('snap');
	var img = document.getElementById('img');
	var save = document.getElementById('save');
	var pub = document.getElementById('pub');
	var say = document.getElementById('say');
	var stream;

	var comment = document.querySelectorAll('.commentt');
	var showStatus = 0;
	var xhttp = new XMLHttpRequest();

	var input = document.getElementById('fileInput');
	var canvas = document.getElementById('canvas');
	var spinner = document.getElementById('spinner');
	var pub = document.getElementById('pub');
	var say = document.getElementById('say');
	var save = document.getElementById('save');
	var preview = document.getElementById('preview');
	var sticker = document.getElementById('sticker');
	var arrowsContainer = document.getElementById('arrowsContainer');
	var i = 0;

	if (next)
	next.onclick = function() {
		if (i < 5)
		i++;
		if (i === 5) {
			next.style.opacity = '0.5';
			next.style.cursor = 'unset';
		}
		if (i > 0) {
			previous.style.opacity = '1';
			previous.style.cursor = 'pointer';
		}
		sticker.src = '/camagru/assets/images/stickers/sticker-'+ i +'.png';
	}

	if (previous)
	previous.onclick = function() {
		if (i > 0)
		i--;
		if (i === 0) {
			previous.style.opacity = '0.5';
			previous.style.cursor = 'unset';
		}
		if (i < 6) {
			next.style.opacity = '1';
			next.style.cursor = 'pointer';
		}
		sticker.src = '/camagru/assets/images/stickers/sticker-'+ i +'.png';
	}

	if (pub)
	pub.addEventListener("keyup", function(e) {
		e.preventDefault();
		save.disabled = (pub.value.length < 1000) ? false : true;
	})

	if (snap)
		snap.disabled = true;
	function initWebCam() {
		if (typeof navigator.mediaDevices === 'object')
		navigator.mediaDevices.getUserMedia({ audio:false, video: true}).then(function (mediaStream) {
			snap.disabled = false;
			if ("srcObject" in video) {
				video.srcObject = mediaStream;
			} else {
				//old version
				video.src = window.URL.createObjectURL(mediaStream);
			}
			stream = mediaStream;
			video.onloadedmetadata = function(e) {
			video.play();
			sticker.style.display = 'block';
		};
		});
	}

	function retake_pic() {
		video.style.display = "block";
		snap.style.display = "block";
		img.style.display = "none";
		say.style.display = "none";
		pub.style.display = "none";
		save.style.display = "none";
		retake.style.display = "none"
		pub.value = "";
		save.disabled = false;
		initWebCam();
	}

	if (video && canvas && img)
	initWebCam();
	if (snap) {
		var sticker = document.getElementById('sticker');
		snap.onclick = function (e) {
			(i);
			e.preventDefault();
			var context = canvas.getContext('2d');
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			context.translate(canvas.width, 0);
			context.scale(-1, 1);
			context.drawImage(video, 0, 0, canvas.width, canvas.height);
			var data = canvas.toDataURL('image/png');
			stream.getTracks().forEach(function(track) {
				track.stop();
			});
			img.setAttribute("src", data);
			img.setAttribute("width", canvas.width);
			img.setAttribute("height", canvas.height);
			video.style.display = "none";
			snap.style.display = "none";
			img.style.display = "block";
			say.style.display = "block";
			save.style.display = "inline-block";
			retake.style.display = "inline-block";

			say.onclick = function() {
				if (pub.style.display !== "block")
					pub.style.display = "block";
				say.style.display = "none";
				if (pub.value > 1000)
						save.disabled = true;
			};

			retake.addEventListener('click', retake_pic);

			var xhttp = new XMLHttpRequest();
			xhttp.open('POST', '/camagru/includes/handlers/post-handler.php', true);
			xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			save.onclick =  function(e) {
				e.preventDefault();
				save.disabled = true;
				xhttp.send('loggedin=true&saveButton=true&publication='+ pub.value +'&pictureData='+data+'&index='+i);
			}
			xhttp.onreadystatechange = function() {
				save.disabled = false;
				if (this.readyState == 4 && this.status == 200) {
					if (xhttp.responseText.match(/All good/g)) {
						var div = document.createElement("div");
						div.setAttribute("class", "alert alert-success message");
						div.setAttribute("id", "message");
						div.innerHTML = "Posted !";
						body.insertBefore(div, body.children[2]);
						setTimeout(function () {
							div.remove();
						}, 5000);
						userPostsContainer.innerHTML = xhttp.responseText.substr(8) + userPostsContainer.innerHTML;
						postHandler();
						deleteHandler();
						commentHandler();
						snap.disabled = true;
						retake_pic();
					}
				}
			}
		};
	}

	/* ************************************************************* */
	/*                             COMMENTS                          */
	/* ************************************************************* */


	commentHandler();
	function newComment() {
		var comantir = document.querySelectorAll('.comantir');
		comantir.forEach(function(d) {
			var post_id = d.id.replace('newCommentButton_', '');
			var comment = document.getElementById('newComment_'+post_id);
			var commentContainer = document.getElementById('commentsContainer_'+post_id);
			var commentCounter = document.getElementById('commentsCounter_'+post_id);
			d.onclick = function(e) {
				e.preventDefault();
				var commentText = comment.value;
				xhttp.open('POST', '/camagru/includes/handlers/comment-handler.php', true);
				xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhttp.send('newCommentButton=true&newComment='+commentText+'&post_id='+post_id);
				xhttp.onreadystatechange = function() {
					comment.value = '';
					if (this.readyState == 4 && this.status == 200) {
						if (xhttp.responseText !== 'nah') {
							var doc = new DOMParser().parseFromString(xhttp.responseText, "text/html");
							commentContainer.insertBefore(doc.childNodes[0].childNodes[1].childNodes[0], commentContainer.childNodes[2]);
							autoResize(comment);
							if (commentCounter.innerHTML === '')
							commentCounter.innerHTML = '1';
							else
							commentCounter.innerHTML = (parseInt(commentCounter.innerHTML) + 1).toString();
						}
					}
					commentHandler();
				}
			}
		});
	}

	function commentToggle() {
	var commentToggler = document.querySelectorAll('.comment');
	commentToggler.forEach(function (d) {
			var post_id = d.parentNode.id.replace('post_', '');
			var commentContainer = document.getElementById('commentsContainer_'+post_id);
			var shareContainer = document.getElementById('shareContainer_'+post_id);
			d.onmouseover = function () {
				d.src = '/camagru/assets/images/comment_1.png'
			}
			d.onmouseout = function () {
				if (commentContainer.style.display !== 'block')
					d.src = '/camagru/assets/images/comment_0.png'
			}
			d.onclick = function() {
				if (commentContainer.style.display === 'block') {
					d.src = '/camagru/assets/images/comment_0.png'
					commentContainer.style.display = 'none';
				} else {
					d.src = '/camagru/assets/images/comment_1.png'
					commentContainer.style.display = 'block';
					shareContainer.style.display = 'none';
				}
				var array = Array.prototype.slice.call(commentContainer.children);
				var i = 0;
				array.forEach(function(e) {
					if (e.id.match(/comment_.+/)) {
						if (i > 1)
							e.style.display = 'none';
						i++;
					}
				});
			}
		});
	}

	function commentHandler() {
		commentToggle();
		newComment();
		toggleDeleteComment();
		toggleShowMore();
		deleteComment();

		var inpot = document.querySelectorAll('.inpot');
		if (inpot)
		inpot.forEach( function(d) {
			d.onkeydown = function(e) {
				e.target.nextElementSibling.firstElementChild.disabled = (e.target.value.length > 500) ? true : false;
				autoResize(e.target)
			}
		})
}

	function autoResize(d) {
			setTimeout(function() {
				d.style.height = 'auto';
				d.style.height = d.scrollHeight + 'px';
			}, 0)
	}

	function toggleDeleteComment() {
		comment = document.querySelectorAll('.commentt');
		comment.forEach(function (d) {
			var id = d.id.replace('comment_', '');
			var delCom = document.getElementById('delCom_'+id);
			d.onmouseover = function () {
				if (delCom)
				delCom.style.display = 'block';
			}
			d.onmouseout = function () {
				if (delCom)
					delCom.style.display = 'none';
			}
		});
	}

	function toggleShowMore() {
		var showMore = document.querySelectorAll('.showMore');
		showMore.forEach(function(d) {
			var id = d.id.replace('show_', '');
			var commentContainer = document.getElementById('commentsContainer_'+id);
			var array = Array.prototype.slice.call(commentContainer.children);
			d.onclick = function () {
				var i = 0;
				if (showStatus === 0) {
					showStatus = 1;
					array.forEach(function (e) {
						if (e.id.match(/comment_.+/)) {
								e.style.display = 'flex';
						}
					})
					d.innerHTML = 'Show less';
				} else {
					showStatus = 0;
					array.forEach(function (e) {
						if (e.id.match(/comment_.+/)) {
							if (i > 1)
								e.style.display = 'none';
							i++;
						}
					})
					d.innerHTML = 'Show more';
				}
		}
		})
	}

	function deleteComment() {
		var delComm = document.querySelectorAll('.deleteComment');
		delComm.forEach(function (e) {
			e.onclick = function() {
				comId = e.id.replace('delCom_', '');
				postId = e.parentNode.parentNode.parentNode.id.replace('commentsContainer_', '');
				commentCounter = document.getElementById('commentsCounter_'+postId);
				xhttp.open('POST', '/camagru/includes/handlers/comment-handler.php', true);
				xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhttp.send('deleteComment=true&postId='+postId+'&commentId='+comId);
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						if (xhttp.responseText !== 'nah') {
							var commentToDelete = document.getElementById('comment_'+comId);
							commentToDelete.remove();
							if (commentCounter.innerHTML === '1')
								commentCounter.innerHTML = '';
							else if (commentCounter.innerHTML !== '' && commentCounter.innerHTML !== '0')
								commentCounter.innerHTML = (parseInt(commentCounter.innerHTML) - 1).toString();
						}
					}
				}
			}
		})
	}

	/* ************************************************************* */
	/*                           imageUploader                       */
	/* ************************************************************* */
	var elementt = document.getElementById('element');
	var uploadBotona = document.getElementById('uploadBotona');
	var dropImg = document.getElementById('dropImg');
	var uploadHeading = document.getElementById('uploadHeading');
	var dropHeading = document.getElementById('dropHeading');

	if (elementt) {
		body.ondragover = function (e) {
			e.preventDefault();
			e.stopPropagation();
			[].slice.call(elementt.children).forEach(function(d) {
					d.style.display = 'none';
			})
			dropImg.style.display = 'block';
			dropHeading.style.display = 'block';
		}
		body.ondrop = function(e) {
			e.preventDefault();
			e.stopPropagation();
			form.style.display = 'block';
			uploadHeading.style.display = 'block';
			dropImg.style.display = 'none';
			dropHeading.style.display = 'none';
		}
		elementt.ondrop = function(e) {
			e.preventDefault();
			e.stopPropagation();
			form.style.display = 'block';
			uploadHeading.style.display = 'block';
			dropImg.style.display = 'none';
			dropHeading.style.display = 'none';

			var dt = e.dataTransfer
			pub.value = '';
			var errors = document.querySelectorAll(".errorMessage");
			var desiredWidth = 668;
			errors.forEach(function (e) {
				e.style.display = "none";
			});
			if (dt.files && dt.files[0]) {
				var file = dt.files[0];
				if (file.size >= 1 && file.size < 8000000) {
					var img = new Image();
					img.src = URL.createObjectURL(file);
					img.onload = function() {
						uploadBotona.style.display = "none";
						say.style.display = "block";
						save.style.display = "block";
						var ctx = canvas.getContext('2d');
						var ratio = img.height / img.width;
						canvas.width = desiredWidth;
						canvas.height = desiredWidth * ratio;
						ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
						var data = canvas.toDataURL();
						preview.src = data;
						preview.style.display = 'block';
						sticker.style.display = 'block';
						sticker.parentNode.style.display = 'block';
						arrowsContainer.style.display = 'block';
						save.onclick = function(e) {
							e.preventDefault();
							say.style.display = 'none';
							pub.style.display = 'none';
							save.style.display = 'none';
							preview.style.display = 'none';
							sticker.style.display = 'none';
							sticker.parentNode.style.display = 'none';
							arrowsContainer.style.display = 'none';
							spinner.style.display = 'block';
							xhttp.open('POST', '/camagru/includes/handlers/post-handler.php', true);
							xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
							xhttp.send('loggedin=true&picture='+data+'&publication='+pub.value+'&index='+ i);
						}
					}
					img.onerror = function() {
						say.style.display = 'none';
						pub.style.display = 'none';
						save.style.display = 'none';
						spinner.style.display = 'block';
						xhttp.open('POST', '/camagru/includes/handlers/post-handler.php', true);
						xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
						xhttp.send('picture=error&publication=error');
					}
				} else {
					('big')
					xhttp.open('POST', '/camagru/includes/handlers/post-handler.php', true);
					xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhttp.send('big=true');
				}
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						if (xhttp.responseText.match(/All good/g)) {
							spinner.style.display = 'none';
							pub.style.display = 'block';
							save.style.display = 'block';
							var div = document.createElement("div");
							div.setAttribute("class", "alert alert-success message");
							div.setAttribute("id", "message");
							div.innerHTML = "Posted !";
							body.insertBefore(div, body.children[2]);
							setTimeout(function () {
								div.remove();
							}, 5000);
							userPostsContainer.innerHTML = xhttp.responseText.substr(8) + userPostsContainer.innerHTML;
							uploadBotona.style.display = "table";
							say.style.display = "none";
							save.style.display = "none";
							pub.style.display = "none";
						} else {
							spinner.style.display = 'none';
							uploadBotona.style.display = 'table';
							var array = xhttp.responseText.split('\n');
							array.forEach(function(e) {
								if (e !== "") {
									var div = document.createElement("div");
									div.setAttribute("class", "alert errorMessage");
									div.innerHTML = e;
									form.insertBefore(div, form.firstChild);
								}
							});
						}
						postHandler();
						deleteHandler();
						commentHandler();
					}
				}
			}
		}
	}
	if (input)
	input.onchange = function() {
		pub.value = '';
		var errors = document.querySelectorAll(".errorMessage");
		var desiredWidth = 668;
		errors.forEach(function (e) {
			e.style.display = "none";
		});
		if (this.files && this.files[0]) {
			var file = this.files[0];
			if (file.size >= 1 && file.size < 8000000) {
				var img = new Image();
				img.src = URL.createObjectURL(file);
				img.onload = function() {
					uploadBotona.style.display = "none";
					say.style.display = "block";
					save.style.display = "block";
					var ctx = canvas.getContext('2d');
					var ratio = img.height / img.width;
					canvas.width = desiredWidth;
					canvas.height = desiredWidth * ratio;
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					var data = canvas.toDataURL();
					preview.src = data;
					preview.style.display = 'block';
					sticker.style.display = 'block';
					arrowsContainer.style.display = 'block';
					save.onclick = function(e) {
						e.preventDefault();
						say.style.display = 'none';
						pub.style.display = 'none';
						save.style.display = 'none';
						preview.style.display = 'none';
						sticker.style.display = 'none';
						arrowsContainer.style.display = 'none';
						spinner.style.display = 'block';
						xhttp.open('POST', '/camagru/includes/handlers/post-handler.php', true);
						xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
						xhttp.send('loggedin=true&picture='+data+'&publication='+pub.value+'&index='+ i);
					}
				}
				img.onerror = function() {
					say.style.display = 'none';
					pub.style.display = 'none';
					save.style.display = 'none';
					spinner.style.display = 'block';
					xhttp.open('POST', '/camagru/includes/handlers/post-handler.php', true);
					xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhttp.send('picture=error&publication=error');
				}
			} else {
				('big')
				xhttp.open('POST', '/camagru/includes/handlers/post-handler.php', true);
				xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhttp.send('big=true');
			}
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if (xhttp.responseText.match(/All good/g)) {
						spinner.style.display = 'none';
						pub.style.display = 'block';
						save.style.display = 'block';
						var div = document.createElement("div");
						div.setAttribute("class", "alert alert-success message");
						div.setAttribute("id", "message");
						div.innerHTML = "Posted !";
						body.insertBefore(div, body.children[2]);
						setTimeout(function () {
							div.remove();
						}, 5000);
						userPostsContainer.innerHTML = xhttp.responseText.substr(8) + userPostsContainer.innerHTML;
						uploadBotona.style.display = "table";
						say.style.display = "none";
						save.style.display = "none";
						pub.style.display = "none";
					} else {
						spinner.style.display = 'none';
						uploadBotona.style.display = 'table';
						var array = xhttp.responseText.split('\n');
						array.forEach(function(e) {
							if (e !== "") {
								var div = document.createElement("div");
								div.setAttribute("class", "alert errorMessage");
								div.innerHTML = e;
								form.insertBefore(div, form.firstChild);
							}
						});
					}
					postHandler();
					deleteHandler();
					commentHandler();
				}
			}
		}
	};

	if (say)
	say.onclick =  function() {
		pub.style.display = 'block';
		say.style.display = 'none';
	}

	/* ************************************************************* */
	/*                              Gallery                          */
	/* ************************************************************* */

	var postsContainer = document.getElementById('postsContainer');
	var userPostsContainer = document.getElementById('userPostsContainer');
	var xhttp = new XMLHttpRequest();
	var start = 0;
	var limit = 5;
	var reachedLimit = false;
	var un;

	if (postsContainer)
	getData();
	if (userPostsContainer)
	getUserData();
	postHandler();
	deleteHandler();
	window.addEventListener('scroll', function() {
		if (document.documentElement.offsetHeight + document.documentElement.scrollTop === document.documentElement.scrollHeight) {
			if (postsContainer)
			getData();
			if (userPostsContainer)
			getUserData();
		}
	})
	postHandler();
	commentHandler();
	function hitLike() {
		document.querySelectorAll('.like').forEach(function(d) {
			d.onclick = function(e) {
				var post_id = e.target.parentNode.id.replace('post_', '');
				var tooltip = document.getElementById('tooltip_'+post_id);
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						if (xhttp.responseText === 'All good') {
							if (e.target.src.split('/')[e.target.src.split('/').length - 1] === 'like-0.png') {
								e.target.src = '/camagru/assets/images/like-1.png';
								if (e.target.nextSibling.innerHTML === '')
									e.target.nextSibling.innerHTML = '1';
								else
									e.target.nextSibling.innerHTML = (parseInt(e.target.nextSibling.innerHTML) + 1).toString();
								if (tooltip)
									tooltip.innerHTML += userLoggedIn.innerHTML +'<br>'
							} else {
								e.target.src = '/camagru/assets/images/like-0.png';
								if (e.target.nextSibling.innerHTML === '1')
									e.target.nextSibling.innerHTML = '';
								else if (e.target.nextSibling.innerHTML !== '' && e.target.nextSibling.innerHTML !== '0')
								e.target.nextSibling.innerHTML = (parseInt(e.target.nextSibling.innerHTML) - 1).toString();
								if (tooltip) {
									tooltip.innerHTML = tooltip.innerHTML.replace(userLoggedIn.innerHTML+'<br>', '');
									if (tooltip.innerHTML === '')
										tooltip.style.visibility = 'hidden';
								}
							}
							e.target.className += ' heartbeat';
							setTimeout(function () {
								e.target.className = 'like';
							}, 500);
						}
					}
				}
				xhttp.open('POST', '/camagru/includes/handlers/post-handler.php', true);
				xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhttp.send('hitLike='+post_id);
			}
		});
	}

	document.querySelectorAll('.like').forEach(function(d) {
		d.onmouseover = function() {
			var post_id = d.parentNode.id.replace('post_', '');
			var tooltip = document.getElementById('tooltip_'+post_id);
			if (tooltip) {
				if (tooltip.innerHTML === '')
					tooltip.style.visibility = 'hidden';
				else
					tooltip.style.visibility = 'visible';
			}
		}
		d.onmouseout = function() {
			var post_id = d.parentNode.id.replace('post_', '');
			var tooltip = document.getElementById('tooltip_'+post_id);
			if (tooltip)
				tooltip.style.visibility = 'hidden';
		}
	})

	function toggleDeletePost() {
		var post = document.querySelectorAll('.post')
		post.forEach(function(d) {
			var del = document.getElementById('delete_'+d.id.replace('post_', ''));
			d.onmouseover = function () {
				if (del)
					del.style.display = 'block';
			}
			d.onmouseout = function () {
				if (del)
					del.style.display = 'none';
			}
		})
	}

	function postHandler() {
		toggleDeletePost();
		hitLike();
		doubleHitLike();
		shareHandler();
	}

	function doubleHitLike() {
		document.querySelectorAll('.postImg').forEach(function(d) {
			d.ondblclick = function(e) {
				var post_id = d.parentNode.id.replace('post_', '');
				var tooltip = document.getElementById('tooltip_'+post_id);
				var heartContainer = document.getElementById('heart_'+post_id);
				var like = document.getElementById('like_'+post_id);
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						if (xhttp.responseText === 'All good') {
							if (like)
							if (like.src.split('/')[like.src.split('/').length - 1] === 'like-0.png') {
								like.src = '/camagru/assets/images/like-1.png';
								if (like.nextSibling.innerHTML === '')
									like.nextSibling.innerHTML = '0';
								like.nextSibling.innerHTML = (parseInt(like.nextSibling.innerHTML) + 1).toString();
								like.className += ' heartbeat';
								setTimeout(function () {
									like.className = 'like';
								}, 500);
								if (tooltip)
									tooltip.innerHTML += userLoggedIn.innerHTML +'<br>'
							} else {
								like.className += ' heartbeat';
								setTimeout(function () {
									like.className = 'like';
								}, 500);
							}
							if (like) {
								var img = document.createElement('img');
								img.src = '/camagru/assets/images/heart.png'
								var length = (d.height < d.width) ? d.height : d.width;
								img.style.height = length / 8 + 'px';
								img.style.width = length / 8 + 'px';
								img.style.position = 'absolute';
								img.style.margin = 'auto';
								img.style.top = d.height / 2 - img.style.height.replace('px' , '') / 2 + 'px';
								img.style.left = d.width / 2 - img.style.width.replace('px', '') / 2 + 'px';
								heartContainer.appendChild(img);
								img.className = "heartbeat2";
								setTimeout(function () {
									img.remove();
								}, 1000);
							}
						}
					}
				}
				xhttp.open('POST', '/camagru/includes/handlers/post-handler.php', true);
				xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhttp.send('doubleHitLike='+post_id);
			}
		})
	}

	function getData() {
		if (reachedLimit)
			return ;
		xhttp.open('POST', '/camagru/includes/handlers/gallery-handler.php', true);
		xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhttp.send('getData=1&start='+start+'&limit='+limit);
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				if (xhttp.responseText === 'reachedLimit') {
					reachedLimit = true;
				} else {
					start += limit;
					if (postsContainer) {
						if (start === 0)
							postsContainer.innerHTML = ''
						postsContainer.innerHTML += xhttp.responseText;
					}
					postHandler();
					commentHandler();
				}
			}
		}
	}

	function getUserData() {
		window.location.search.substr(1).split('&').forEach(function (a) {
			if (a.match(/username/))
				un = a.split('=')[1];
		});
		if (reachedLimit)
			return ;
		xhttp.open('POST', '/camagru/includes/handlers/gallery-handler.php', true);
		xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhttp.send('getData=1&start='+start+'&limit='+limit+'&loggedin=1&username='+un);
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				if (xhttp.responseText === 'reachedLimit') {
					reachedLimit = true;
				} else {
					start += limit;
					if (userPostsContainer) {
						if (start === 0)
							userPostsContainer.innerHTML = ''
						userPostsContainer.innerHTML += xhttp.responseText;
					}
					postHandler();
					commentHandler();
				}
			}
		}
	}

	/* ************************************************************* */
	/*                          DeleteHandler                        */
	/* ************************************************************* */

	function deleteHandler() {
		onclick = function(e) {
			if (e.target.className === 'delete float-right my-auto') {
			body.style.overflow = 'hidden';
			alertContainer.style.visibility = 'visible';
			alertContainer.style.opacity = '1';
			post_id = e.target.parentNode.id.replace('post_', '');
			} else if (e.target === alertCancel || e.target.id === 'alert-container' || e.target.id === 'alert-body') {
				alertContainer.style.opacity = '0';
				setTimeout(function () {
					alertContainer.style.visibility = 'hidden';
				}, 500);
				body.style.overflow = 'unset';
			}
			else if (e.target === alertDelete) {
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						if (xhttp.responseText === 'All good') {
							var div = document.createElement("div");
							div.setAttribute("class", "alert alert-success message");
							div.setAttribute("id", "message");
							div.innerHTML = "Deleted !";
							body.insertBefore(div, body.children[2]);
							setTimeout(function () {
								div.remove();
							}, 5000);
							start = 0;
							document.getElementById('post_'+post_id).remove();
							body.style.overflow = 'unset';
							postHandler();
							deleteHandler();
							commentHandler();
						}
					}
				}
				xhttp.open('POST', '/camagru/includes/handlers/post-handler.php', true);
				xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhttp.send('loggedin=true&delete=true&post_id='+post_id);
				setTimeout(function () {
					alertContainer.style.visibility = 'hidden';
				}, 500);alertContainer.style.visibility = 'hidden';
				alertContainer.style.opacity = '0';
				body.style.overflow = 'unset';
			}
		}
	}

	/* ************************************************************* */
	/*                           ShareHandler                        */
	/* ************************************************************* */

	function shareHandler() {
		var share = document.querySelectorAll('.share');

		share.forEach(function(d) {
			var postId = d.id.replace('share_', '');
			var shareContainer = document.getElementById('shareContainer_'+postId);
			var commentsContainer = document.getElementById('commentsContainer_'+postId);
			var commentToggler = document.getElementById('comment_'+postId);
			d.onclick = function(e) {
				if (shareContainer.style.display === 'none') {
					shareContainer.style.display = 'block';
					commentsContainer.style.display = 'none';
					commentToggler.src = '/camagru/assets/images/comment_0.png';
				}
				else
					shareContainer.style.display = 'none';
			}
		})
	}
})