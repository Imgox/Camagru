<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<link rel="icon" href="/camagru/assets/images/logo.ico">
<link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Lobster&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/camagru/assets/frameworks/bootstrap/css/bootstrap.css">
<link rel="stylesheet" href="/camagru/assets/css/global.css">
<?php
	if (isset($_COOKIE['theme']) && $_COOKIE['theme'] === '1')
		echo '<link rel="stylesheet" href="/camagru/assets/css/light-mode.css">';
	else
		echo '<link rel="stylesheet" href="/camagru/assets/css/dark-mode.css">';
?>