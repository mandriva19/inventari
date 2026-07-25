window.addEventListener('error', function(e) {
  document.body.innerHTML += '<div style="color:red;z-index:9999;position:fixed;top:0;left:0;background:white;padding:20px;border:2px solid red;"><h1>Global Error</h1><pre>' + e.message + '\n' + e.filename + ':' + e.lineno + '</pre></div>';
});
window.addEventListener('unhandledrejection', function(e) {
  document.body.innerHTML += '<div style="color:red;z-index:9999;position:fixed;top:0;left:0;background:white;padding:20px;border:2px solid red;"><h1>Unhandled Promise Rejection</h1><pre>' + (e.reason && e.reason.stack ? e.reason.stack : e.reason) + '</pre></div>';
});
