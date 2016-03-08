/* POLYFILL */
document.createElement('template');

(function (d) {
  if ('content' in d.createElement('template')) {
    return false;
  }

  var qPlates = d.getElementsByTagName('template');
  var plateLen = qPlates.length;
  var elPlate;
  var qContent;
  var contentLen;
  var docContent;

  for (var x = 0; x < plateLen; ++x) {
    elPlate = qPlates[x];
    qContent = elPlate.childNodes;
    contentLen = qContent.length;
    docContent = d.createDocumentFragment();

    while (qContent[0]) {
      docContent.appendChild(qContent[0]);
    }

    elPlate.content = docContent;
  }
})(document);
