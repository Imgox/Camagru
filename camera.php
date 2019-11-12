<?php
	session_start();
	if (!isset($_SESSION) || !isset($_SESSION['userLoggedIn']))
		header('Location: /camagru/index.php');
	include_once('includes/config.php');
	include_once('includes/classes/Post.class.php');
	try {
		$query = "SELECT * FROM users, posts WHERE users.id=posts.user_id AND username=:username ORDER BY dateOfPub DESC";
		$stmt = $pdo->prepare($query);
		$stmt->bindValue(':username', $_SESSION['userLoggedIn']);
		$stmt->execute();
		if ($stmt === false)
			die('An error occured communicating with the databases');
	} catch (PDOException $e) {
		die('An error occured communicating with the databases');
	}
	$result = $stmt->fetchAll();
	function put_posts($arr, $pdo) {
		$post = new Post($pdo);
		foreach ($arr as $element) {
			$post->putPost($element);
		}
	}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<?php include_once("includes/links.php") ?>
	<title>Camagru - Take a new photo</title>
	<link rel="stylesheet" href="/camagru/assets/css/login.css">
	<link rel="stylesheet" href="/camagru/assets/css/camera.css">
	<script src="/camagru/assets/js/camera.js"></script>
</head>
<body id="body">
	<?php include_once("includes/navbar.php") ?>
	<div class="container-fluid">
		<div class="row">
			<div class="col-xs-1 col-md-1"></div>
			<div class="colona col-xs-12 col-md-5">
				<div class="element jumbotron">
					<h1 class="h2 text-break">Smile at the camera!</h1>
					<video id="video" class="video" autoplay>yes</video>
					<button id="snap" class="botona">
						<img src="/camagru/assets/images/snap.png" alt="snap" width="25" height="20">
						Snap
					</button>
					<img class="preview" id="img" alt="preview">
					<button id="say" class="botona say">
						<img src="/camagru/assets/images/say.png" alt="say" width="20" height="20">
						Say something
					</button>
					<textarea id="pub" name="pub" class="inputt" placeholder="What's on your mind today?"></textarea>
					<button id="save" class="botona">
						<img src="/camagru/assets/images/save.png" alt="save" width="20" height="20">
						Save
					</button>
					<button id="retake" class="botona">
						<img src="/camagru/assets/images/retake.png" alt="retake" width="20" height="20">
						Retake
					</button>
				</div>
			</div>
			<div class="col-xs-1 col-md-1"></div>
			<div class="colona col-xs-6 col-md-4">
				<h1 class="h2 text-break">Your recent posts:</h1>
				<?php put_posts($result, $pdo); ?>
			</div>
			<div class="col-xs-1 col-md-1"></div>
		</div>
	</div>
		<canvas id="canvas"></canvas>
</body>
</html>