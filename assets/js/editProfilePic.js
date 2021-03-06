Array.prototype.myEach = function(callback) {
	for (var i = 0; i < this.length; i++)
		callback(this[i], i, this);
};

Object.prototype.myEach = function(callback) {
	for (var i = 0; i < this.length; i++)
		callback(this[i], i, this);
};

window.addEventListener('load', function() {
	var xhttp = new XMLHttpRequest();
	var input = document.getElementById("newPicture");
	var canvas = document.getElementById("canvas");
	var absoluteDiv = document.getElementById("absoluteDiv");
	var spinner = document.getElementById("spinner");
	var data = "";

	if (input)
	input.onchange = function() {
		var errors = document.querySelectorAll(".errorMessage");
		errors.myEach(function (e) {
			e.style.display = "none";
		});
		spinner.style.display = "block";
		if (this.files && this.files[0]) {
			var file = this.files[0];
			var size = file.size;
			var img = new Image();
			if (size >= 1 && size < 8000000) {
				img.src = URL.createObjectURL(file);
				img.onload = function() {
					var desiredWidth = 600;
					var context = canvas.getContext("2d");
					var ratio = img.height / img.width;
					canvas.width = desiredWidth;
					canvas.height = desiredWidth * ratio;
					context.drawImage(img, 0, 0, canvas.width, canvas.height);
					data = canvas.toDataURL();
					xhttp.open("POST", "/camagru/includes/handlers/edit-handler.php", true);
					xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhttp.send("newPicture="+data);
				};
				img.onerror = function() {
					xhttp.open("POST", "/camagru/includes/handlers/edit-handler.php", true);
					xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhttp.send("imageError=true");
				}
			} else {
				if (file.size <= 1) {
					xhttp.open("POST", "/camagru/includes/handlers/edit-handler.php", true);
					xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhttp.send("imageError=true");
				} else {
					xhttp.open("POST", "/camagru/includes/handlers/edit-handler.php", true);
					xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhttp.send("big=true");
				}
			}
			xhttp.onreadystatechange = function() {
				spinner.style.display = "none";
				if (this.readyState == 4 && this.status == 200) {
					if (xhttp.responseText === "All good") {
						document.querySelectorAll('.profilepic').myEach(function(d) {
							d.style.backgroundImage = 'url(\'' + data + '\')';
						})
						absoluteDiv.style.backgroundImage = "url('"+data+"'";
						var div = document.createElement("div");
						div.setAttribute("class", "alert alert-success message popup");
						div.setAttribute("id", "message");
						div.innerHTML = "Your Profile picture has been changed successfully";
						document.getElementById('messages').appendChild(div);
						setTimeout(function () {
							div.remove();
						}, 5000);
					}
					else {
						var array = xhttp.responseText.split('\n');
						array.myEach(function(e) {
							if (e !== "") {
							var div = document.createElement("div");
							div.setAttribute("class", "alert errorMessage");
							div.innerHTML = e;
							form.insertBefore(div, form.firstChild);
						}
						});
					}
				}
			};
		} else {
			spinner.style.display = 'none';
		}
	};
});