class Session {

  constructor() {
    this.deleteBtns = Array.from(document.querySelectorAll('.deleteBtn'));
    this.updateBtns = Array.from(document.querySelectorAll('.updateBtn'));
    this.updateSbmt = document.querySelector('#updateSubmit');
  }

  inits() {
    this.deleteInit();
    this.updateInit();
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

  updateInit() {
    this.updateBtns.forEach(a => {
      a.addEventListener('click', this.updateRender);
    });
    this.updateSbmt.addEventListener('click', this.updateAction);
  }

  async updateRender(e) {
    try {
      const id = e.target.getAttribute('item-id');
      const data = await (await fetch (`/item/${id}`)).json();
      const {_id, image, name, brand, price, dateAcquired, locationAcquired, condition, tags} = data[0];
      document.querySelector('#updateId').value                 = _id;
      document.querySelector('#updateImagePreview').src         = `uploads/images/${image}`;
      document.querySelector('#updateName').value               = name;
      document.querySelector('#updateBrand').value              = brand;
      document.querySelector('#updatePrice').value              = price;
      document.querySelector('#updateDateAcquired').value       = dateAcquired;
      document.querySelector('#updateLocationAcquired').value   = locationAcquired;
      document.querySelector('#updateCondition').value          = condition;
      document.querySelector('#updateTags').value               = tags;
    } catch(err) {
      console.log(err);
    }
  }

  updateAction(e) {
    const formData  = new FormData();
    formData.append('id',             document.querySelector('#updateId').value)
    formData.append('imageNew',       document.querySelector('#updateImage').files[0])
    formData.append('name',           document.querySelector('#updateName').value)
    formData.append('brand',          document.querySelector('#updateBrand').value)
    formData.append('price',          document.querySelector('#updatePrice').value)
    formData.append('dateAcquired',   document.querySelector('#updateDateAcquired').value)
    formData.append('placeAcquired',  document.querySelector('#updateLocationAcquired').value)
    formData.append('condition',      document.querySelector('#updateCondition').value)
    formData.append('tags',           document.querySelector('#updateTags').value)
    formData.append('imageDelete',    (document.querySelector('#updateImagePreview').src).replace(/^.*[\\\/]/, ''))
    fetch('/updateItem', {
      method: 'put',
      body: formData,
    })
      .then(res => {
        window.location.reload(true);
      })
      .catch(err => {
        console.log(err)
      })
  }

}

const session = new Session();
session.inits();


// const updateButtons = document.querySelectorAll('.update');
// Array.from(updateButtons).forEach(updateBtn => {
//   updateBtn.addEventListener('click', showUpdateModal);
// });
// const updateItemBg = document.querySelector('.updateItem .bg');
// updateItemBg.addEventListener('click', hideUpdateModal)

// async function showUpdateModal(e) {
//   const title = e.target.querySelector('span').innerHTML;
//   const updateItem = document.querySelector('.updateItem');
//   updateItem.classList.add('active');
//   const response = await fetch (`/item/${title}`);
//   const data = await response.json();

//   if (!(data[0].tags.length === 1 && data[0].tags[0] === null)) {
//     data[0].tags.forEach(tag => {
//       document.querySelector(`.updateItem #update${tag}`).checked = true;
//     })
//   } 
// }