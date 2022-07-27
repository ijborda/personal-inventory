class Session {

  constructor() {
    
    // Actions
    this.deleteBtns = Array.from(document.querySelectorAll('.deleteBtn'));
    this.updateBtns = Array.from(document.querySelectorAll('.updateBtn'));

    // Image Preview
    this.addImagePreview = document.querySelector('#addImagePreview');
    this.addImage = document.querySelector('#addImage');
    this.updateImagePreview = document.querySelector('#updateImagePreview');
    this.updateImage = document.querySelector('#updateImage');
    
    // Update    
    this.updateForm = document.querySelector('#updateItemForm');
    this.updateSbmt = document.querySelector('#updateSubmit');

  }

  inits() {

    // Core
    this.deleteInit();
    this.updateInit();

    // UI/UX 
    this.imagePreview();

  }

  deleteInit() {
    this.deleteBtns.forEach(a => a.addEventListener('click', this.deleteAction));
  }

  async deleteAction(e) {
    try {
      const id = e.target.getAttribute('item-id');
      await fetch('/deleteItem', {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: id})
      })
      window.location.reload(true);
    } catch (err) {
      console.log(err);
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
      data[0]['tags'] = data[0]['tags'].join(', ');
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
        let name = a.id;
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
    const previewSets = [[this.updateImage, this.updateImagePreview],
                         [this.addImage, this.addImagePreview]]
    previewSets.forEach(([input, preview]) => {
      input.onchange = () => {
        const [file] = input.files;
        if (file) {
          preview.src = URL.createObjectURL(file);
        }
      } 
    })
  }

}

const session = new Session();
session.inits();


String.prototype.smallFirst = function() {
  return this.charAt(0).toLowerCase() + this.slice(1);
}