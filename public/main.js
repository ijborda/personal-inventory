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

    // Image View
    this.imageViewBtns=  Array.from(document.querySelectorAll('.imageViewBtn'));

  }

  inits() {

    // Core
    this.deleteInit();
    this.updateInit();

    // UI/UX 
    this.imagePreview();
    this.imageView();

    // Functionalities
    this.searchAction();

  }

  deleteInit() {
    this.deleteBtns.forEach(a => a.addEventListener('click', this.deleteAction));
  }

  async deleteAction(e) {
    try {
      let result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!'
      })
      if (result.isConfirmed) {
        const id = e.target.getAttribute('item-id');
        await fetch('/deleteItem', {
          method: 'delete',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id: id})
        })
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `Item has been deleted.`,
          html: 'Site will automatically reload.',
          showConfirmButton: false,
          timer: 2000,
        });
        window.location.reload(true);
      }
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
      data['tags'] = data['tags'].join(', ');
      Array.from(this.updateForm.elements).forEach(a => {
        let name = a.id.replace(/update/, '').smallFirst();
        if (a.type === 'file') {
          this.updateImagePreview.src = data["image"];;
        } else {
          name = name === 'id' ? '_id' : name;
          a.value = data[name];
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
      await Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `Item has been updated.`,
        html: 'Site will automatically reload.',
        showConfirmButton: false,
        timer: 2000,
      });
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

  imageView() {
    this.imageViewBtns.forEach(a => a.addEventListener('click', this.imageViewAction.bind(this)));
  }

  imageViewAction(e) {
    const id = e.target.getAttribute('item-id');
    console.log(e.target)
    let src = document.querySelector(`#id-${id} img`).getAttribute('src');
    document.querySelector('.image-view-holder img').src = src;
  }

  searchAction() {
    $(document).ready(function () {
      $('#search').autocomplete({
        // Define the source of the autocomplete results
        source: async function(req, res) {
          let data = await (await fetch(`/search?query=${req.term}`)).json();
          console.log(data);
          let results = data.map(result => {
            return {
              label: result.brand,
              value: result.brand,
              id: result._id,
            }
          })
          res(results)
        }, 
        // Minimum Length
        minLength: 2,
        // Define the action when a result is selected
        select: async function(_, ui) {
          const id = ui.item.id;
          console.log(id);
          const data = await (await fetch (`/item/${id}`)).json();
          console.log(data);
        }
      })
    })
  }
}

const session = new Session();
session.inits();


String.prototype.smallFirst = function() {
  return this.charAt(0).toLowerCase() + this.slice(1);
}

