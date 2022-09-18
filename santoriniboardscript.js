/* my attempt at creating a santorini sandbox -borisqwertz */
// Wait for side ready
$(document).ready(function () {
    var imgDome = '<img src="images/dome.svg" alt="kreis" height="auto" width="100%" id="dome">';
    var imgLevel1 = '<img src="images/buildLevel.svg" alt="level1" height="auto" width="100%" id="level1">';

    var droppedInCell, oldCell, currentClass, currentToken;
    var turnNumber = 1;
    var touchSupp, touchMove, touchBuild, touchDome, touchRemove;
    var moveLog = $("#moveText").val(); // \n for linebreak

    // On new pageload draw the board with the params from the URL
    drawBoardfromURL()

    $("#writeURLButton").click(function () { writeURL(); });
    $("#loadBoardButton").click(function () { location.reload(); });
    $("#resetButton").click(function () { window.history.replaceState({}, '', location.pathname); location.reload(); });
    $("#clearLogButton").click(function () { clearLog(); });
    $("#createShortURLButton").click(function () { writeURL(); createShortURL(); });
    $("#textURL").click(function () { this.select(); });

    $("#p1Button").click(function () { $("#p1Button").text($("#godslist").val()); });
    $("#p2Button").click(function () { $("#p2Button").text($("#godslist").val()); });
    $("#p3Button").click(function () { $("#p3Button").text($("#godslist").val()); });
    $("#p4Button").click(function () { $("#p4Button").text($("#godslist").val()); });

    // Disable Middle Mouse Scroll
    $("body").mousedown(function (e) { if (e.button == 1) return false });





    // If mouse button pressed on board do this
    $(".dropZone").mousedown(function () {
        if ($(".workerOnField:hover").length > 0 || $(".tokenOnField:hover").length > 0 || touchMove) {
            return;
        }
        var i = (Number)($(this).attr("data-blocks"));

        if (touchBuild) {
            if (i < 3 && $(this).attr("data-dome") == 0) {
                i++;
                $(this).attr("data-blocks", i)
                moveLog += "\n" + turnNumber + ".\tBUILD block(" + i + ")" + " on " + $(this).attr("id");
                updateLog();
            }
            else if ($(this).attr("data-dome") == 0) {
                $(this).attr("data-dome", "1");
                moveLog += "\n" + turnNumber + ".\tBUILD dome on " + $(this).attr("id");
                updateLog();
            }
            draw(this);
            return;
        }

        if (touchRemove) {
            if ($(this).attr("data-dome") == 1) {
                $(this).attr("data-dome", "0");
                moveLog += "\n" + turnNumber + ".\tremove dome from " + $(this).attr("id");
                updateLog();
            } else if (i > 0) {
                i--;
                $(this).attr("data-blocks", i)
                moveLog += "\n" + turnNumber + ".\tremove block(" + i + ") from " + $(this).attr("id");
                updateLog();
            }
            draw(this);
            return;
        }
        if (touchDome) {
            switch ($(this).attr("data-dome")) {
                case "1":
                    $(this).attr("data-dome", "0");
                    moveLog += "\n" + turnNumber + ".\tremove dome from " + $(this).attr("id");
                    updateLog();
                    break;
                case "0":
                    $(this).attr("data-dome", "1");
                    moveLog += "\n" + turnNumber + ".\tBUILD dome on " + $(this).attr("id");
                    updateLog();
                    break;
            }
            draw(this);
            return;
        }

        switch (event.which) {
            // Left mouse button add blocks
            case 1:
                if (i < 3 && $(this).attr("data-dome") == 0) {
                    i++;
                    $(this).attr("data-blocks", i)
                    moveLog += "\n" + turnNumber + ".\tBUILD block(" + i + ")" + " on " + $(this).attr("id");
                    updateLog();
                }
                else if ($(this).attr("data-dome") == 0) {
                    $(this).attr("data-dome", "1");
                    moveLog += "\n" + turnNumber + ".\tBUILD dome on " + $(this).attr("id");
                    updateLog();
                }
                break;
            // Right mouse button remove blocks
            case 3:
                if ($(this).attr("data-dome") == 1) {
                    $(this).attr("data-dome", "0");
                    moveLog += "\n" + turnNumber + ".\tremove dome from " + $(this).attr("id");
                    updateLog();
                } else if (i > 0) {
                    i--;
                    $(this).attr("data-blocks", i)
                    moveLog += "\n" + turnNumber + ".\tremove block(" + i + ") from " + $(this).attr("id");
                    updateLog();
                }
                break;
            // middleclick build dome if not there or vice versa            
            case 2:
                switch ($(this).attr("data-dome")) {
                    case "1":
                        $(this).attr("data-dome", "0");
                        moveLog += "\n" + turnNumber + ".\tremove dome from " + $(this).attr("id");
                        updateLog();
                        break;
                    case "0":
                        $(this).attr("data-dome", "1");
                        moveLog += "\n" + turnNumber + ".\tBUILD dome on " + $(this).attr("id");
                        updateLog();
                        break;
                }
                break;
        }
        draw(this);
    });

    // Update log
    function updateLog() {
        turnNumber++;
        $("#moveText").val(moveLog)
        $("#moveText").scrollTop($("#moveText")[0].scrollHeight);
    }

    // Clear log
    function clearLog() {
        turnNumber = 0;
        moveLog = "Gamelog:";
        updateLog();
    }

    // The named cell (eg a1) gets drawn new
    function draw(tdToFill) {
        // Empty the cell
        $(tdToFill).empty();
        // Check and draw dome
        if ($(tdToFill).attr("data-dome") == 1) {
            $(tdToFill).prepend(imgDome);
        }
        // Draw the blocks
        var x = 0;
        while (x < Number($(tdToFill).attr("data-blocks"))) {
            $(tdToFill).append(imgLevel1);
            x++;
        }
        // Draw the tokens
        if ($(tdToFill).attr("data-token4") != 0) {
            var idName = $(tdToFill).attr("data-token4");
            $(tdToFill).prepend($("#" + idName).clone().draggable({ helper: "clone" }).css("position", "static").attr("class", "tokenOnField"));
        }
        if ($(tdToFill).attr("data-token3") != 0) {
            var idName = $(tdToFill).attr("data-token3");
            $(tdToFill).prepend($("#" + idName).clone().draggable({ helper: "clone" }).css("position", "static").attr("class", "tokenOnField"));
        }
        if ($(tdToFill).attr("data-token2") != 0) {
            var idName = $(tdToFill).attr("data-token2");
            $(tdToFill).prepend($("#" + idName).clone().draggable({ helper: "clone" }).css("position", "static").attr("class", "tokenOnField"));
        }
        if ($(tdToFill).attr("data-token1") != 0) {
            var idName = $(tdToFill).attr("data-token1");
            $(tdToFill).prepend($("#" + idName).clone().draggable({ helper: "clone" }).css("position", "static").attr("class", "tokenOnField"));
        }
        // Draw the worker
        if ($(tdToFill).attr("data-worker") != 0) {
            var idName = $(tdToFill).attr("data-worker");
            $(tdToFill).prepend($("#" + idName).clone().draggable({ helper: "clone" }).css("position", "static").attr("class", "workerOnField"));
        }
    }

    // Figures from toolbox are draggable and a clone of it gets dragged
    $(".figures").draggable({
        helper: "clone",
        start: function (event, ui) {
            currentToken = $(this).attr("data-token");
            // console.log(currentToken + "drag from toolbox started");
        }
    });

    // 
    $("body").on("dragstart", ".workerOnField, .tokenOnField",
        function (event, ui) {
            droppedInCell = false;
            oldCell = $(this).parent().attr("id");
            currentClass = $(this).attr("class");
            currentToken = $(this).attr("data-token");
            // console.log("Drag from field start old cell: " + oldCell);
        }
    );

    // OnField things getting dragged out of the field get deleted
    $("body").on("dragstop", ".workerOnField, .tokenOnField",
        function (event, ui) {
            if (!droppedInCell) {
                // If workerOnField dropped outside delete
                if (currentClass == "workerOnField") {
                    moveLog += "\n" + turnNumber + ".\tremove " + $("#" + oldCell).attr("data-worker") + " from " + oldCell;
                    updateLog();
                    $("#" + oldCell).attr("data-worker", "0");
                    // Find the right token and delete it
                } else {
                    switch (currentToken) {
                        case $("#" + oldCell).attr("data-token1"):
                            moveLog += "\n" + turnNumber + ".\tremove " + $("#" + oldCell).attr("data-token1") + " from " + oldCell;
                            updateLog();
                            $("#" + oldCell).attr("data-token1", "0");
                            break;
                        case $("#" + oldCell).attr("data-token2"):
                            moveLog += "\n" + turnNumber + ".\tremove " + $("#" + oldCell).attr("data-token2") + " from " + oldCell;
                            updateLog();
                            $("#" + oldCell).attr("data-token2", "0");
                            break;
                        case $("#" + oldCell).attr("data-token3"):
                            moveLog += "\n" + turnNumber + ".\tremove " + $("#" + oldCell).attr("data-token3") + " from " + oldCell;
                            updateLog();
                            $("#" + oldCell).attr("data-token3", "0");
                            break;
                        case $("#" + oldCell).attr("data-token4"):
                            moveLog += "\n" + turnNumber + ".\tremove " + $("#" + oldCell).attr("data-token4") + " from " + oldCell;
                            updateLog();
                            $("#" + oldCell).attr("data-token4", "0");
                            break;
                    }
                    // console.log("currentToken dropped outside: " + currentToken);
                }
                draw($("#" + oldCell));
                oldCell = false;
                currentClass = false;
                currentToken = false;
                // console.log(oldCell);
            }
        }
    );

    // Handle things getting dragged into cell a1, b1 ...
    $(".dropZone").droppable({
        accept: ".figures, .workerOnField, .tokenOnField",
        drop: function (event, ui) {
            droppedInCell = true;
            // If drag and dropped from same cell exit
            if ($(this).attr("id") == oldCell) {
                // console.log("yes old is new cell");
                return;
            }
            var currentWorker = $(ui.draggable).attr("data-worker");
            var currentDome = $(this).attr("data-dome");
            // Can only place a new worker if there is no dome
            if (currentWorker && currentDome == 0) {
                $(this).attr("data-worker", currentWorker);
                if (!oldCell) {
                    moveLog += "\n" + turnNumber + ".\t" + currentWorker + " on " + $(this).attr("id");
                    updateLog();
                }
            }
            // Find first empty data-token and write token from toolbox into data
            if (currentToken) {
                switch ("0") {
                    case $(this).attr("data-token1"):
                        $(this).attr("data-token1", currentToken);
                        break;
                    case $(this).attr("data-token2"):
                        $(this).attr("data-token2", currentToken);
                        break;
                    case $(this).attr("data-token3"):
                        $(this).attr("data-token3", currentToken);
                        break;
                    case $(this).attr("data-token4"):
                        $(this).attr("data-token4", currentToken);
                        break;
                }
                if (!oldCell) {
                    moveLog += "\n" + turnNumber + ".\t" + currentToken + " on " + $(this).attr("id");
                    updateLog();
                }
            }
            // Handle dropped from oldCell/clear oldCell
            if (currentClass == "workerOnField") {
                moveLog += "\n" + turnNumber + ".\t" + $("#" + oldCell).attr("data-worker") + " from " + oldCell + " to " + $(this).attr("id");
                updateLog();
                $("#" + oldCell).attr("data-worker", "0");
                draw($("#" + oldCell));
            } else if (currentClass == "tokenOnField") {
                switch (currentToken) {
                    case $("#" + oldCell).attr("data-token1"):
                        moveLog += "\n" + turnNumber + ".\t" + $("#" + oldCell).attr("data-token1") + " from " + oldCell + " to " + $(this).attr("id");
                        updateLog();
                        $("#" + oldCell).attr("data-token1", "0");
                        break;
                    case $("#" + oldCell).attr("data-token2"):
                        moveLog += "\n" + turnNumber + ".\t" + $("#" + oldCell).attr("data-token2") + " from " + oldCell + " to " + $(this).attr("id");
                        updateLog();
                        $("#" + oldCell).attr("data-token2", "0");
                        break;
                    case $("#" + oldCell).attr("data-token3"):
                        moveLog += "\n" + turnNumber + ".\t" + $("#" + oldCell).attr("data-token3") + " from " + oldCell + " to " + $(this).attr("id");
                        updateLog();
                        $("#" + oldCell).attr("data-token3", "0");
                        break;
                    case $("#" + oldCell).attr("data-token4"):
                        moveLog += "\n" + turnNumber + ".\t" + $("#" + oldCell).attr("data-token4") + " from " + oldCell + " to " + $(this).attr("id");
                        updateLog();
                        $("#" + oldCell).attr("data-token4", "0");
                        break;
                }
                draw($("#" + oldCell));
            }
            // Draw the current cell new
            draw(this);
            oldCell = false;
            currentClass = false;
            currentToken = false;
            // console.log("oldCell: " + oldCell);
        }
    });

    // Read from URL and draw
    function drawBoardfromURL() {
        let url = window.location;
        let params = new URLSearchParams(url.search.slice(1));
        for (var pair of params.entries()) {
            // use string slice to find the right data attr und cell
            switch (pair[0].slice(3)) {
                case "blocks":
                    $("#" + pair[0].slice(0, 2)).attr("data-blocks", pair[1]);
                    draw($("#" + pair[0].slice(0, 2)));
                    break;
                case "dome":
                    $("#" + pair[0].slice(0, 2)).attr("data-dome", pair[1]);
                    draw($("#" + pair[0].slice(0, 2)));
                    break;
                case "worker":
                    $("#" + pair[0].slice(0, 2)).attr("data-worker", pair[1]);
                    draw($("#" + pair[0].slice(0, 2)));
                    break;
                case "token1":
                    $("#" + pair[0].slice(0, 2)).attr("data-token1", pair[1]);
                    draw($("#" + pair[0].slice(0, 2)));
                    break;
                case "token2":
                    $("#" + pair[0].slice(0, 2)).attr("data-token2", pair[1]);
                    draw($("#" + pair[0].slice(0, 2)));
                    break;
                case "token3":
                    $("#" + pair[0].slice(0, 2)).attr("data-token3", pair[1]);
                    draw($("#" + pair[0].slice(0, 2)));
                    break;
                case "token4":
                    $("#" + pair[0].slice(0, 2)).attr("data-token4", pair[1]);
                    draw($("#" + pair[0].slice(0, 2)));
                    break;
            }
        }
        if (params.has("p1")) {
            $("#p1Button").text(params.get("p1"));
        }
        if (params.has("p2")) {
            $("#p2Button").text(params.get("p2"));
        }
        if (params.has("p3")) {
            $("#p3Button").text(params.get("p3"));
        }
        if (params.has("p4")) {
            $("#p4Button").text(params.get("p4"));
        }
    }

    // Create a short url to share
    function createShortURL() {
        var longURL = window.location.href;
        $.get("https://tinyurl.com/api-create.php?url=" + longURL, function (shorturl) {
            $("#textURL").val(shorturl);
        });
    }

    function writeURL() {
        let newParams = new URLSearchParams();
        window.history.replaceState({}, '', location.pathname);

        $(".dropZone").each(function (index) {
            if ($(this).attr("data-blocks") != 0) {
                // console.log($(this).attr("id") + ": " + $(this).attr("data-blocks"));
                newParams.set($(this).attr("id") + "-blocks", $(this).attr("data-blocks"));
            }
            if ($(this).attr("data-dome") == "1") {
                newParams.set($(this).attr("id") + "-dome", $(this).attr("data-dome"));
            }
            if ($(this).attr("data-worker") != 0) {
                newParams.set($(this).attr("id") + "-worker", $(this).attr("data-worker"));
            }
            if ($(this).attr("data-token1") != 0) {
                newParams.set($(this).attr("id") + "-token1", $(this).attr("data-token1"));
            }
            if ($(this).attr("data-token2") != 0) {
                newParams.set($(this).attr("id") + "-token2", $(this).attr("data-token2"));
            }
            if ($(this).attr("data-token3") != 0) {
                newParams.set($(this).attr("id") + "-token3", $(this).attr("data-token3"));
            }
            if ($(this).attr("data-token4") != 0) {
                newParams.set($(this).attr("id") + "-token4", $(this).attr("data-token4"));
            }
        });
        if ($("#p1Button").text() != "Player 1") {
            newParams.set("p1", $("#p1Button").text());
        }
        if ($("#p2Button").text() != "Player 2") {
            newParams.set("p2", $("#p2Button").text());
        }
        if ($("#p3Button").text() != "Player 3") {
            newParams.set("p3", $("#p3Button").text());
        }
        if ($("#p4Button").text() != "Player 4") {
            newParams.set("p4", $("#p4Button").text());
        }
        // update the page's URL
        window.history.replaceState({}, '', `${location.pathname}?${newParams}`);
    }

    /*
    Touch support
    */
   
    $("#touchNo").click(function () { $(".touchDiv").hide(), touchMove= 0 });
    // for firefox
    if ($("#touchNo").is(":checked")) { $(".touchDiv").hide(), touchMove= 0 };

    $("#touchYes").click(function () {
        if (!(touchSupp)) {
            touchSupp = 1;
            touchBuild = 0;
            touchDome = 0;
            touchRemove = 0;
            touchMove = 1;
            $(".touchDiv").append(
                $(document.createElement("button")).prop({
                    type: "button",
                    innerHTML: "move",
                    id: "moveButton",
                }).click(function () { touchBuild = 0, touchDome = 0, touchRemove = 0, touchMove = 1 }),

                $(document.createElement("button")).prop({
                    type: "button",
                    innerHTML: "dome",
                    id: "domeButton",
                }).click(function () { touchBuild = 0, touchDome = 1, touchRemove = 0, touchMove = 0 }),

                $(document.createElement("button")).prop({
                    type: "button",
                    innerHTML: "remove",
                    id: "removeButton"
                }).click(function () { touchBuild = 0, touchDome = 0, touchRemove = 1, touchMove = 0 }),

                $(document.createElement("button")).prop({
                    type: "button",
                    innerHTML: "build",
                    id: "buildButton"
                }).click(function () { touchBuild = 1, touchDome = 0, touchRemove = 0, touchMove = 0 }),
            )

        }
    });



});
