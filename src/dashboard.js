document.addEventListener("DOMContentLoaded", () => {
    let userId = "paul",
        newRoom = document.querySelector("#newRoom"),
        chat = Bind(
        {
            rooms: [
                {id: 1, title: "First Room"},
                {id: 2, title: "Second Room"},
                {id: 3, title: "Last"}
            ]
        },
        {
            rooms: {
                dom: '#rooms',
                transform: function (value) {
                    return `<li><a href="#${value.id}">${value.title}</a></li>`;
                },
            }
        });
;

    var connect = function (username) {
        var socket = new WebSocket("ws://localhost:9002/");

        socket.onopen = function (event) {
            socket.send(JSON.stringify({type: "CONNECT", username: username}));
        };

        socket.onclose = function () {
            console.log("You were disconnected from the server");
        };

        socket.onmessage = function (event) {
            var data = JSON.parse(event.data);
            console.log("dt", data.type);

            switch (data.type) {
                case "CLIENT_LIST":
                    // refreshClientsList(data.body);
                    break;
                case "ROOM_LIST":
                    chat.rooms = data.body;
                    break;
                case "USER_ID":
                    userId = data.body;
                    break;
                case "MESSAGE":
                    console.log("msg " + data.body.username + ": " + data.body.message);
                    chat.rooms.push({id: 1, title: data.body.message});
                    break;
            }
        };

        socket.onerror = function (event) {
            console.log(event);
        };

        window.onbeforeunload = function () {
            socket.onclose = function () {
            };
            socket.close()
        };

        document.querySelector('#addRoom').onsubmit = function (event) {
            event.preventDefault();
            let obj = {
                type: "ADD_ROOM",
                title: newRoom.value
            };

            socket.send(JSON.stringify(obj));

            newRoom.value = "";
        };

    };


    connect(userId);

});