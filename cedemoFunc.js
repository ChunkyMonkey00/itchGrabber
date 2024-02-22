function logMsg() {
  console.log("This ok function alerts my message!");
}

logMsg();

function replaceFunction(str, invoke = false) {
_temp_ = str;

_callback_ = new Function(_temp_.substring(_temp_.indexOf('{') + 1, _temp_.lastIndexOf('}')));

if(invoke) _callback_();

return _callback_;
}

logMsg = replaceFunction("function logMsg(){console.log('hAcKeD!');}");

logMsg();
