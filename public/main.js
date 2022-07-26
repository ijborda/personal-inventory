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

    this.updateForm = document.querySelector('#updateItemForm')
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

  async deleteAction(e) {
    try {
      const id = e.target.getAttribute('item-id');
      await fetch('/deleteItem', {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: id})
      })
      window.location.reload(true)
    } catch (err) {
      console.log(err)
    }
  }

  updateInit() {
    this.updateBtns.forEach(a => a.addEventListener('click', this.updateReview.bind(this)));
    this.updateSbmt.addEventListener('click', this.updateAction.bind(this));
  }

  async updateReview(e) {
    try {
      const id = e.target.getAttribute('item-id');
      const data = await (await fetch (`/item/${id}`)).json();
      Array.from(this.updateForm.elements).forEach(a => {
        let name = a.id.replace(/update/, '').smallFirst();
        if (a.type === 'file') {
          this.updateImagePreview.src = data[0]["image"];;
        } else {
          name = name === 'id' ? '_id' : name;
          a.value = data[0][name];
        }
      })
    } catch(err) {
      console.log(err);
    }
  }

  async updateAction() {
    try {
      const formData  = new FormData();
      Array.from(this.updateForm.elements).forEach(a => {
        let name = a.id.replace(/update/, '').smallFirst();
        if (a.type === 'file') {
          formData.append(name, a.files[0]);
        } else {
          formData.append(name, a.value);
        }
      }) 
      await fetch('/updateItem', {
        method: 'put',
        body: formData
      })
      window.location.reload(true);
    } catch (err) {
      console.log(err);
    }
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


String.prototype.smallFirst = function() {
  return this.charAt(0).toLowerCase() + this.slice(1);
}