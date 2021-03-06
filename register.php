<?php 
	session_start();
	if (isset($_SESSION) && isset($_SESSION['userLoggedIn']))
		header('Location: /camagru/gallery');
	include_once ($_SERVER['DOCUMENT_ROOT'] . "/camagru/includes/config.php");
	include_once ($_SERVER['DOCUMENT_ROOT'] . "/camagru/includes/classes/Account.class.php");
	include_once ($_SERVER['DOCUMENT_ROOT'] . "/camagru/includes/classes/Constants.class.php");
	$account = new Account($pdo);
	include_once ($_SERVER['DOCUMENT_ROOT'] . "/camagru/includes/handlers/register-handler.php");

	function getInputValue($name)
	{
		if (isset($_POST[$name]))
		{
			echo $_POST[$name];
		}
	}
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<?php include($_SERVER['DOCUMENT_ROOT'] . "/camagru/includes/links.php") ?>
		<link rel="stylesheet" href="/camagru/assets/css/login.css">
		<title>Camagru - Sign up</title>
		<script src="/camagru/assets/js/themeSwitcher.js"></script>
	</head>
<body>
	<?php include($_SERVER['DOCUMENT_ROOT'] . "/camagru/includes/navbar.php"); ?>
	<div class="everything">
		<div class="back" id="bg"></div>
		<div class="container">
			<div class="jumbotron">
				<a href="javascript:history.back()" class="goback">
					<img src="/camagru/assets/images/icons-dark/goback.png" alt="go back" width="30" height="30">
				</a>
				<h1 class="signup display-3">Sign up !</h1>
				<form action="register.php" method="POST">
					<?php echo $account->getError(Constants::$usernameCharacters); ?>
					<?php echo $account->getError(Constants::$usernameTaken); ?>
					<?php echo $account->getError(Constants::$usernameIsNotValid); ?>
					<input name="registerUsername" class="form-control form-control-lg inputt" type="text" placeholder="Username" value="<?php getInputValue('registerUsername') ?>" required>
					<?php echo $account->getError(Constants::$emailsDoNotMatch); ?>
					<?php echo $account->getError(Constants::$emailInvalid); ?>
					<?php echo $account->getError(Constants::$emailTaken); ?>
					<input name="registerEmail" class="form-control form-control-lg inputt" type="email" placeholder="Email" value="<?php getInputValue('registerEmail') ?>" required>
					<input name="registerEmail2" class="form-control form-control-lg inputt" type="email" placeholder="Re-type Email" value="<?php getInputValue('registerEmail2') ?>" required>
					<?php echo $account->getError(Constants::$passwordsDoNotMatch); ?>
					<?php echo $account->getError(Constants::$passwordIsNotValid); ?>
					<?php echo $account->getError(Constants::$passwordCharacters); ?>
					<input name="registerPassword" class="form-control form-control-lg inputt" type="password" placeholder="Password" required>
					<input name="registerPassword2" class="form-control form-control-lg inputt" type="password" placeholder="Re-type Password" required>
					<input type="checkbox" name="notif" id="notif">
					<span class="label-checkini">Please don't email me about notifications.</span><br>
					<button name="registerButton" type="submit" class="btn-lg login-btn botona">Sign Up</button>
					<span class="text-break" style="font-size:15px"> or <a href="/camagru/login">Login</a> if you alreay have an account.</span>
				</form>
			  </div>
		</div>
	</div>
	<div class="loading-container" id="loading" style="display: flex;">
		<!-- <div class="spinner-border m-auto" style="color: white;"></div> -->
		<svg class="logo-svg" width="142" height="142" viewBox="0 0 142 142" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="0.5" y="0.5" width="141" height="141" rx="25.5" stroke="white"/>
			<circle cx="71.0001" cy="71" r="42.5656" stroke="white"/>
			<circle cx="70.9999" cy="71" r="33.2541" stroke="white"/>
			<circle cx="120.602" cy="19.3398" r="7.06557" stroke="white"/>
			<rect x="0.5" y="33.0901" width="8.31148" height="75.8197" rx="4.15574" stroke="white"/>
		</svg>
	</div>
</body>
</html>
