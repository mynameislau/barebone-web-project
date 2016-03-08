(function () {
  window.scala = window.scala || {};

  window.scala.windowLoaded = new Promise(function (resolve, reject)
  {
    window.addEventListener('load', function ()
    {
      console.log('window loaded');
      resolve();
    });
  });

  window.scala.documentReady = new Promise(function (resolve, reject)
  {
    var stateCheck = setInterval(function ()
    {
      if (document.readyState === 'complete')
      {
        console.log('document is ready');
        clearInterval(stateCheck);
        resolve();
      }
    }, 100);
  });
}());
