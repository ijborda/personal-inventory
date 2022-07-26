class Session {

  constructor() {
    
    // Actions
    this.deleteBtns = Array.from(document.querySelectorAll('.deleteBtn'));
    this.updateBtns = Array.from(document.querySelectorAll('.updateBtn'));

    // Submits | Update
    this.updateSbmt = document.querySelector('#updateSubmit');
    
    // Form Fields | Update
    this.updateId = document.querySelector('#updateId')               
    this.updateImage = document.querySelector('#updateImage')
    this.updateName = document.querySelector('#updateName')
    this.updateBrand = document.querySelector('#updateBrand')
    this.updatePrice = document.querySelector('#updatePrice')
    this.updateDateAcquired = document.querySelector('#updateDateAcquired') 
    this.updateLocationAcquired = document.querySelector('#updateLocationAcquired')
    this.updateCondition = document.querySelector('#updateCondition') 
    this.updateTags = document.querySelector('#updateTags')       

    // Image preview
    this.updateImagePreview = document.querySelector('#updateImagePreview')
  }

  inits() {
    this.deleteInit();
    this.updateInit();
    this.imagePreview();
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
      this.updateImagePreview.src         = image;
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

  updateAction() {
    const formData  = new FormData();
    formData.append('id',                this.updateId.value)
    formData.append('imageNew',          this.updateImage.files[0])
    formData.append('name',              this.updateName.value)
    formData.append('brand',             this.updateBrand.value)
    formData.append('price',             this.updatePrice.value)
    formData.append('dateAcquired',      this.updateDateAcquired.value)
    formData.append('locationAcquired',  this.updateLocationAcquired.value)
    formData.append('condition',         this.updateCondition.value)
    formData.append('tags',              this.updateTags.value)
    fetch('/updateItem', {
      method: 'put',
      body: formData,
    })
      .then(_ => window.location.reload(true))
      .catch(err => console.log(err))
  }

  imagePreview() {
    this.updateImage.onchange = _ => {
      const [file] = this.updateImage.files;
      if (file) {
        this.updateImagePreview.src = URL.createObjectURL(file);
      }
    } 
  }

}

const session = new Session();
session.inits();