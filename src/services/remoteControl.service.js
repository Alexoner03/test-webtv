const keyEventHandler = (event) => {
    var keyCode = event.keyCode;
    var type = event.type;
    var key = event.key || event.keyIdentifier;

    if (key) {
        updateText("span.key_name", key);
        updateText("span.key_code", keyCode);
        updateText("span.key_status", type);
    }
    //cursor hide for webOS 1.x
    if (type === "keydown" && keyCode === 1537) {
        console.log(type + "  " + keyCode + "  " + key);
    }
};

const controller = () => {

}

export default  controller