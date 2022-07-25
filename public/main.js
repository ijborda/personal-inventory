class Session {

  constructor() {
    
    // Actions
    this.deleteBtns = Array.from(document.querySelectorAll('.deleteBtn'));
    this.updateBtns = Array.from(document.querySelectorAll('.updateBtn'));

    // Submits | Update
    this.updateSbmt = document.querySelector('#updateSubmit');
    
    // Fields | Update
    this.updateId = document.querySelector('#updateId')               
    this.updateImagePreview = document.querySelector('#updateImagePreview')
    this.updateImage = document.querySelector('#updateImage')
    this.updateName = document.querySelector('#updateName')
    this.updateBrand = document.querySelector('#updateBrand')
    this.updatePrice = document.querySelector('#updatePrice')
    this.updateDateAcquired = document.querySelector('#updateDateAcquired') 
    this.updateLocationAcquired = document.querySelector('#updateLocationAcquired')
    this.updateCondition = document.querySelector('#updateCondition') 
    this.updateTags = document.querySelector('#updateTags')       

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
    this.updateBtns.forEach(a => a.addEventListener('click', this.updateReview.bind(this)));
    this.updateSbmt.addEventListener('click', this.updateAction.bind(this));
  }

  async updateReview(e) {
    try {
      const id = e.target.getAttribute('item-id');
      const data = await (await fetch (`/item/${id}`)).json();
      const {_id, image, name, brand, price, dateAcquired, locationAcquired, condition, tags} = data[0];
      this.updateId.value                 = _id;
      this.updateImagePreview.src         = `uploads/images/${image}`;
      this.updateName.value               = name;
      this.updateBrand.value              = brand;
      this.updatePrice.value              = price;
      this.updateDateAcquired.value       = dateAcquired;
      this.updateLocationAcquired.value   = locationAcquired;
      this.updateCondition.value          = condition;
      this.updateTags.value               = tags;
    } catch(err) {
      console.log(err);
    }
  }

  updateAction(e) {
    const formData  = new FormData();
    formData.append('id',                document.querySelector('#updateId').value)
    formData.append('imageNew',          document.querySelector('#updateImage').files[0])
    formData.append('name',              document.querySelector('#updateName').value)
    formData.append('brand',             document.querySelector('#updateBrand').value)
    formData.append('price',             document.querySelector('#updatePrice').value)
    formData.append('dateAcquired',      document.querySelector('#updateDateAcquired').value)
    formData.append('locationAcquired',  document.querySelector('#updateLocationAcquired').value)
    formData.append('condition',         document.querySelector('#updateCondition').value)
    formData.append('tags',              document.querySelector('#updateTags').value)
    formData.append('imageDelete',       (document.querySelector('#updateImagePreview').src).replace(/^.*[\\\/]/, ''))
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