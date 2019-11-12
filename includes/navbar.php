<?php
	include_once("includes/config.php");
	if (isset($_SESSION['userLoggedIn'])) {
		$username = $_SESSION['userLoggedIn'];
		$query = "SELECT * FROM users WHERE username = :userLoggedIn";
		try {
			$stmt = $pdo->prepare($query);
			$stmt->bindValue(":userLoggedIn", $username);
			$stmt->execute();
		} catch (PDOException $e) {
			die("Error communicating with the database:" . $e );
		}
		$array = $stmt->fetch();
		$email = $array["email"];
		$picPath = $array["profilePic"];
	}
?>

<script src="/camagru/assets/js/responsiveNavbar.js"></script>
<div class="topnav" id="navbarElements">
	<a class="navbar-brand" href="/camagru/index.php">
		<img src="/Camagru/assets/images/logo.svg" width="30" height="30" class="d-inline-block align-top" alt="">
		<span id="brand"> Camagru </span>
	</a>
	<?php
		if (isset($_SESSION['userLoggedIn'])) {
		echo '
		<a class="" href="/Camagru/logout.php">
			<img class="logout" src="/Camagru/assets/images/logout.png" width="25" height="25" class="d-inline-block align-top" alt="">
			<span class="text"> Log out </span>
		</a>
		<a class="" href="/Camagru/profile.php" id="">
			<img id="imgNavbar" class="profilepic" src="'. $picPath .'" width="30" height="30" class="d-inline-block align-top" alt="">
			<span class="text" id="userLoggedIn">'. $username .'</span>
		</a>


		
		';
		}else{
		echo '
		<a class="" href="/Camagru/login.php">
			<img class="logout" src="/Camagru/assets/images/login.png" width="25" height="25" class="d-inline-block align-top" alt="">
			<span class="text"> Log in </span>
		</a>
		';
		}
		?>
		<a href="#" class="bars">
			<img src="/camagru/assets/images/bars.png" width="30" height="30" id="collapsor">
		</a>
</div>