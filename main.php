<!--- ------------------------------------------------------------------------ ---
-								Author: Tibor Vellai							 -
-				Web based waste collection game (main php file)                 -
-                   Master thesis @University of Fribourg 2021                   -
--- ------------------------------------------------------------------------- --->

<?php
    session_start();
?>

<!DOCTYPE html>

<html lang="en">
    <head>
        <meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Waste collection</title>
        <!-- Manifest file -->
        <link rel="manifest" href="manifest.json"/>
        <!-- Main css file -->
        <link type="text/css" rel="stylesheet" href="main.css"/>
        <!-- jQuery ajax for calling php queries -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js" type="text/javascript" defer></script>
        <!-- Main js file -->
        <script src="main.js" type="module" defer></script>
    </head>

    <body>
        <!-- Header -->
        <div id="header">

            <!-- UNIFR logo -->
            <div id="unifr-logo"><img src="./pics/logo.png"></div>

            <!-- User -->
            <div id="user">
                <form id="user-form" action="./login/logout.php" method="post" style="display: flex;">
                    <?php
                        if (isset($_SESSION["useruid"])) {
                            echo "<div id='user-name'>Welcome " . $_SESSION["useruid"] . "!</div>";
                            echo "<button id='logout-button'>Logout</button>";
                            echo "<div id='logout-warn'>Your current game will be lost!</div>";
                        } else {
                            if (isset($_GET["error"])) {
                                if ($_GET["error"] == "empty") {
                                    echo "<div>Make sure not to leave empty fields!</div>";
                                } else if ($_GET["error"] == "stmtfailed") {
                                    echo "<div>STMT failed.</div>";
                                } else if ($_GET["error"] == "nonmatch") {
                                    echo "<div>No username or email found!</div>";
                                } else if ($_GET["error"] == "wrongpw") {
                                    echo "<div>Incorrect password!</div>";
                                } else if ($_GET["error"] == "wrongname") {
                                    echo "<div>Incorrect name provided.</div>";
                                } else if ($_GET["error"] == "wrongusername") {
                                    echo "<div>Incorrect username provided.</div>";
                                } else if ($_GET["error"] == "wrongemail") {
                                    echo "<div>Incorrect email provided.</div>";
                                } else if ($_GET["error"] == "pwmissmatch") {
                                    echo "<div>Passwords do not match.</div>";
                                } else if ($_GET["error"] == "nameemailtaken") {
                                    echo "<div>Username or email adress already taken!</div>";
                                } else if ($_GET["error"] == "emptydb") {
                                    echo "<div>DB is empty. No one played yet.</div>";
                                }
                            } else if (isset($_GET["user"])) {
                                if ($_GET["user"] == "usercreated") {
                                    echo "<div>New user has been created in the DB. You may login now.</div>";
                                }
                            } else {
                                echo "<div>You are not logged in!</div>";
                            }
                        }
                    ?>
                </form>
            </div>

            <!-- Title and author -->
            <div id="title">Web based waste collection game</div>
            <div id="author">Author: Tibor Vellai <i>@University of Fribourg 2021</i></div>

            <!-- Menu Buttons -->
            <div id="menu">

                <!-- Login system -->
                <div id="login">
                    <button id="login-button">Login</button>
                    <form name="Login" id="login-popup" action="./login/login.php" method="post">
                        <div>Username:</div><input id="username" name="userName"/>
						<div>Password:</div><input type="password" id="password" name="pwd"/><span id="eye"><img name="login-show" class="eye-show" src="./pics/eye-show.png"><img name="login-hide" class="eye-hide" src="./pics/eye-hide.png"></span>
                        <input id="login-ok" type="submit" name="submit">
                        <div style="text-align: center;">No account yet? <a id="register"><b><u>Register</u></b></a></div>
                        <div id="game-running" style="color: rgb(255, 69, 0); display: none;">Running game will be canceled!</div>
                    </form>

                    <form name="Register" id="register-popup" action="./login/register.php" method="post">
                        <span class="close-button" id="register-close">&#x1F830</span>
                        <div style="text-align: center;">Register</div>
                        <div>Name:</div><input id="name" name="name">
                        <div>Username:</div><input id="username" name="userName"/>
                        <div>Password:</div><input id="password" name="pwd" type="password"/><span id="eye"><img name="register-show" class="eye-show" src="./pics/eye-show.png"><img name="register-hide" class="eye-hide" src="./pics/eye-hide.png"></span>
                        <div>Confirm password:</div><input id="password" name="pwdRepeat" type="password"/><span id="eye"><img name="repeat-show" class="eye-show" src="./pics/eye-show.png"><img name="repeat-hide" class="eye-hide" src="./pics/eye-hide.png"></span>
                        <div>E-mail:</div><input id="userEmail" name="userEmail"/>
                        <input id="register-ok" type="submit" name="submit">
                    </form>

                    <script type="text/javascript">
                        if (document.getElementById('logout-button')) {
                            document.getElementById('login-button').setAttribute('title', 'You are already logged in');
                            document.getElementById('login-button').disabled = true;
                        }
                    </script>
                </div>

                <!-- HOMEPAGE -->
                <div class="dropdown">
                    <button class="menu-button" id="home">Home</button>
                </div>

                <!-- FIRST Button (Arcade) -->
                <div class="dropdown">
                    <button class="menu-button" id="button-one">Arcade</button>
                    <div class="dropdown-content" id="dropdown-content-1">
                        <span class="close-button" id="close-dropdown-1" style="position: absolute; right: 8px; top: 5px; cursor: pointer;">X</span>                            
                        <div style="text-align: center; margin-bottom: 18px;">Play Arcade</div>
                        <a class="level" id="level-1">Level 1</a>
                        <a class="level" id="level-2">Level 2</a>
                        <a class="level" id="level-3">Level 3</a>
                        <a class="level" id="level-4">Level 4</a>
                    </div>
                </div>

                <!-- SECOND Button (SelfBuilder) -->
                <div class="dropdown">
                    <button class="menu-button" id="button-two">Self builder</button>
                    <div class="dropdown-content" id="dropdown-content-2">
                        <span class="close-button" id="close-dropdown-2" style="position: absolute; right: 8px; top: 5px; cursor: pointer;">X</span>
                        <div style="text-align: center; margin-bottom: 18px;">Create your own game</div>
                        <div style="display: flex; margin: 8px;">
                            <div>Number of rows: </div>
                            <div style="flex: 1 1 auto;"></div>
                            <input type="number" id="numberOfRows" placeholder="max: 60" style="float: right;"/>
                        </div>
                        <div style="display: flex; margin: 8px;">
                            <div>Number of columns: </div>
                            <div style="flex: 1 1 auto;"></div>
                            <input type="number" id="numberOfColls" placeholder="max: 60" style="float: right;"/>
                        </div>
                        <div style="display: flex; margin: 8px;">
                            <div>Number of demand: </div>
                            <div style="flex: 1 1 auto;"></div>
                            <input id="numberOfDemand" type="number" placeholder="max: 20" style="float: right;"/>
                        </div>
                        <div style="display: flex; margin: 8px;">
                            <div>Number of vehicles: </div>
                            <div style="flex: 1 1 auto;"></div>
                            <input id="numberOfVehicles" type="number" placeholder="max: 5" style="float: right;"/>
                        </div>
                        <div id="transfer-distance" style="display: flex; margin: 8px;">
                            <div>Max transfer distance: </div>
                            <select id="transfer-distance-options" style="width: 12%; margin-left: 2%;">
								<option>0</option>
								<option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
							</select>
                        </div>
                        <div id="capcities" style="display: flex; margin-left: 8px;">
                            <div>Enable capacity: </div>
                            <input type="radio" name="choice" value="yes" style="margin-left: 13%;">Yes
                            <input type="radio" name="choice" value="no">No (CTP)
                        </div>
                        <div id="vehicles-capacities" style="margin-left: 8px; margin-right: 8px;"></div>
                        <a id="dropdown-2-ok" href="#">OK</a>
                    </div>
                </div>

                <!-- THIRD Button -->
                <div class="dropdown">
                    <button class="menu-button" id="ranking">View ranking</button>
                    <div class="dropdown-content" id="dropdown-content-3">
                        <span class="close-button" id="close-dropdown-3" style="position: absolute; right: 8px; top: 5px; cursor: pointer;">X</span>
                        <a class="rank" id="rank-0">Level 1</a>
                        <a class="rank" id="rank-1">Level 2</a>
                        <a class="rank" id="rank-2">Level 3</a>
                        <a class="rank" id="rank-3">Level 4</a>
                    </div>    
                </div>

                <!-- FOURTH Button -->
                <div class="dropdown">
                    <button class="menu-button" id="description">Description</button>
                </div>

            </div>

            <!-- Console -->
            <div id="console">
                <div id="console-title">Console<a id="console-toggle" title="Expand">&#8595;</a></div>
                <div id="console-content"></div>
                <div id="console-footer">
                    <div id="total-cost">Total cost: 0</div>
                    <div id="separator"></div>
                    <div id="temp-cost">Current cost: 0</div>
                </div>
                <div id="console-buttons">
                    <button id="backer">Undo path</button>
                    <button id="show-hide-button">Show details</button>
                    <button id="ready-button">Ready</button>
                </div>
            </div>

        </div>

        <!-- Screen loader -->
        <div id="loader">
            <table id="loading-table">
                <tr>
                    <td></td>
                    <td><img id="spinner" src="./pics/spinner.gif"></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td><p>Loading...</p></td>
                    <td></td>
                </tr>
            </table>
        </div>

        <!-- Alert in game -->
        <div id="game-alert">
            <div>An active game is currently running. Do you wish to exit and continue?</div>
            <button class="menu-button" id="game-alert-yes">Yes</button>
            <button class="menu-button" id="game-alert-no">No</button>
        </div>

        <!-- Win screen -->
        <div id="win-screen">
            <div><h1>Congratulations!</h1></div>
            <div></div>
            <div></div>
            <div id="total-score"></div>
            <div id="total-time"></div>
            <div id="win-screen-after">
                <button class="win-button" id="previous-lvl">Prevous level</button>
                <button class="win-button" id="next-lvl">Next level</button>
            </div>
        </div>

        <!-- Description -->
        <div id="description-div">
            <div id="description-title">
                <h1>Description / Tips & Tricks</h1>
                <button id="description-close">Close</button>
            </div>
            <div id="description-header">
                <p><h4>Welcome to waste collection! On this page you will find a short tour guide about the application, followed along with 
                some tipps and tricks which you might need later on while playing.</h4></p>
            </div>

            <div id="description-content">
                <div id="description-content-header">
                    <h3>1) Description of the menu: </h3>
                    <img src="./pics/header.png">
                    <p>
                        The menu contains most of the main coordinating functionalities of the whole application, rather than the displaying effects 
                        and the game itself (on the canvas below the menu). To the left, the login button can be found. The user can register by creating 
                        a new user and use this account to measeure the created cost to other users, after successfully completing a level.
                        In the middle of the screen, four buttons can be seen:
                    </p>
                    <ol>
                        <li>
                            <h4>Login/register: </h4>The login system displayed in a popup. The user needs to register first. After registering the account 
                            can be used to log in to save the score of a level.
                        </li>
                        <li>
                            <h4>Home: </h4>Homepage of the application. Returni to it possible at any time (may cancel ongoing game --> popup 
                            for confirmation).
                        </li>
                        <li>
                            <h4>Arcade: </h4>Lists all the levels which are currently available. The levels can always be started at any point 
                            of the application. If this happens during an active game, a popup will be prompted for confirmation to proceed. 
                        </li>
                        <li>
                            <h4>Self builder:</h4>Lets the user define a self made level and play directly after the creation. Possible elements 
                            to define: number of cells, number of wastes, number of vehicles (and their capacity (can also be infinite --> CTP)), 
                            transfer distance of the wastes.
                        </li>
                        <li>
                            <h4>Ranking: </h4>Open up the ranking position of the current user of the ranked level. The ranks are measured by the users 
                            accounts and their total cost per level. If users have the same cost, a timer (which was generated during gameplay) 
                            will decide the rank.
                        </li>
                        <li>
                            <h4>Description: </h4>By clicking it the current page opens.
                        </li>
                        <li>
                           <h4>Console:</h4> Acts as internal console of the application. It gives the 
                            user instructions and shows up details during a level. The console can also be used to track the current cost in a level. 
                            On the bottom left, the user might use the button to blend in or blend out the details of the wastes and the 
                            depot (garage). If a level contains the dragging feature of the wastes, a ready button will appear which serves as confirmation 
                            button to proceed in the level. In place of the ready button (after clicking it), a undo path button will appear which serves 
                            as an undo button during the collection of the wastes. By using this button the user might jump back steps during the creation 
                            of the temporary paths. Once a vehicle is returned to the depot the paths cannot be be undone anymore.
                        </li>
                    </ol>
                </div>

                <div id='description-content-canvas'>
                    <h3>2) Description of Gameboard/canvas and the game process: </h3>
                    <p>
                        The gamebaord serves as the games physical platform whenever a level is initiated. The platform itself is displayed in a 
                        dynamic grid. The size of it is generated by a level. The main objective in the game is to select a vehicle from the garage 
                        and collect all the wastes by clicking them. The routes are generated automatically by finding the nearest route (according to the 
                        Manhattan Metric). The goal is to create the smalllest routes possible. Two additional features may be involved, depending 
                        of a level. The first one is the capacity of the vehicles. They must be taken into account while collecting the wastes. 
                        The second one is the dragging feature which simulates the inhabitants bringing their wastes to a common collection point. 
                        The user can basically drag wastes together according to a given transfer value. This allows to create even smaller routes. 
                        If a level contains this feature, the user can drag the wastes at the start of the level. After clicking the ready button, 
                        the wastes are becomming non draggable and the collection process starts. 
                    </p>
                </div>
            </div>
        </div>

        <div id="homepage">
            <div>
                Welcome to our game! We ask you to locate waste bags and/or containers and design the routes that the vehicles will perform to visit them. 
                The goal is to collect all the waste at the minimum cost, which depends on the distance travelled by the vehicles and the number of waste bags/containers. 
                To locate the containers, drag the waste bags together to the same point in the grid. You can also leave or move the waste bags alone and they’ll be collected separately. 
                To design the routes, select a vehicle, click on the waste bags/containers to visit and click the depot so that a route is completed. If your cost is the lowest one among all participants’ costs, you’ll win a small prize!  
                Too much information? Don’t worry! We have prepared three tutorial levels for you to get familiar with the application before playing the final game. At the beginning of each level, we’ll give you the instructions that remind you what needs to be done. Furthermore, you’ll find the main instructions on the right while playing. 
                Make sure to register and log in to record your score. Good luck!
            </div>         
        </div>

        <!-- Canvas (Gameboard) -->
        <div id="canvas"></div>

    </body>
</html>