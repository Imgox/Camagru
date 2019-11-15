<?php
	if (!isset($_SESSION))
		session_start();
	if (!isset($_SESSION) || !isset($_SESSION['userLoggedIn'])) {
		header('Location: /camagru');
	}
	include_once('config.php');
	include_once('classes/Post.class.php');
	$subquery = '';
	if (isset($loggedin) && $loggedin === true)
		$subquery = 'WHERE username=:username';
	try {
		$query = "SELECT username, profilePic, picture, publication, post_id FROM users INNER JOIN posts ON users.id = posts.user_id " . $subquery . " ORDER BY dateOfPub DESC";
		// die($query);
		$stmt = $pdo->prepare($query);
		$stmt->bindValue(':username', $_SESSION['userLoggedIn']);
		$stmt->execute();
		if ($stmt === false)
			die('An error occured communicating with the databases');
	} catch (PDOException $e) {
		die('An error occured communicating with the databases');
	}
	$result = $stmt->fetchAll();
	$post = new Post($pdo);
	if ($result) {
		foreach ($result as $element) {
			$post->putPost($element);
		}
	} else {
		// echo '<img class="nothing" src="/camagru/assets/images/nothing.png">';
	}