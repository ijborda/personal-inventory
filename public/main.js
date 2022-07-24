class Session {

  constructor() {
    this.deleteBtns = Array.from(document.querySelectorAll('.deleteBtn'));
  }

  deleteInit() {
    this.deleteBtns.forEach(a => {
      a.addEventListener('click', this.deleteAction);
    });
  }

  deleteAction(e) {
    const id = e.target.getAttribute('item-id');
    const img = (document.querySelector(`#id-${id} img`).src).replace(/^.*[\\\/]/, '');
    fetch('/deleteItem', {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: id,
          image: img
        })
    })
    .then(_ => window.location.reload(true))
    .catch(err => console.log(err))
  }

}

const session = new Session();
session.deleteInit();