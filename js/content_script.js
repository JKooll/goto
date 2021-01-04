// elements id
var gotocontainerid = 'gotocontainer';
var tagbtnid = 'tagbtn';
var tagscontainerid = 'tagscontainer';

if (!document.getElementById(gotocontainerid)) {
  createGoto();
}

function createGoto() {
  var gotocontainer = document.createElement("div");
  gotocontainer.setAttribute("id", gotocontainerid);

  var tags = [
    {
      'name': 'Top',
      'offsets': [0, 0]
    }
  ];

  // create tag button
  var tagbtn = document.createElement('button');
  tagbtn.setAttribute('id', tagbtnid);
  tagbtn.textContent = 'TAG!';
  tagbtn.onclick = function () {
    tags.push({
      'name': '#' + tags.length,
      'offsets': [window.pageXOffset, window.pageYOffset]
    });
    renderTagsContainer();
  }
  gotocontainer.appendChild(tagbtn);

  // goto method
  function goto(pageXOffset, pageYOffset) {
    window.scrollTo(pageXOffset, pageYOffset);
  }

  // remove tag
  function removeTag(removingTag) {
    tags = tags.filter(tag => tag.name != removingTag.name);
    renderTagsContainer();
  }

  // render tags container
  function renderTagsContainer() {
    var tagscontainer = document.createElement('ul');
    tagscontainer.setAttribute("id", tagscontainerid);
    for (var tag of tags) {
      var tagsitemcontainer = document.createElement('li');
      var tagsitembtn = document.createElement('button');
      tagsitembtn.textContent = tag.name;
      tagsitembtn.onclick = goto.bind(null, tag.offsets[0], tag.offsets[1]);
      tagsitembtn.ondblclick = removeTag.bind(null, tag);
      tagsitemcontainer.appendChild(tagsitembtn);
      tagscontainer.appendChild(tagsitemcontainer);
    }
    // remove previous tagscontainer
    if (document.getElementById(tagscontainerid)) {
      gotocontainer.removeChild(document.getElementById(tagscontainerid));
    }
    // add tags container to goto container
    gotocontainer.appendChild(tagscontainer);
  }

  // add goto container to document body
  renderTagsContainer();
  document.body.appendChild(gotocontainer);
}
