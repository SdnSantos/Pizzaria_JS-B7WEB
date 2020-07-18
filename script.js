const cart = []
let modalQt = 1
let modalKey = 0

let modalPrice
let modalPriceTotal

const qs = (el) => document.querySelector(el)
const qsa = (el) => document.querySelectorAll(el)

// Listagem das Pizzas
pizzaJson.map((item, index) => {
  const pizzaItem = qs('.models .pizza-item').cloneNode(true)

  pizzaItem.setAttribute('data-key', index)
  pizzaItem.querySelector('.pizza-item--img img').src = item.img
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description

  pizzaItem.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault()

    // .closest() pega o elemento que for passado mais próximo do atual
    // o atual aqui seria a tag 'a'
    const key = e.target.closest('.pizza-item').getAttribute('data-key')

    modalQt = 1
    modalKey = key
    modalPrice = item.price

    qs('.pizzaBig img').src = pizzaJson[key].img
    qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name
    qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
    qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`

    qs('.pizzaInfo--size.selected').classList.remove('selected')

    qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
      if (sizeIndex === 2) {
        size.classList.add('selected')
      }

      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
    })

    qs('.pizzaInfo--qt').innerHTML = modalQt

    qs('.pizzaWindowArea').style.opacity = 0
    qs('.pizzaWindowArea').style.display = 'flex'

    setTimeout(() => {
      qs('.pizzaWindowArea').style.opacity = 1
    }, 200)
  })

  qs('.pizza-area').append(pizzaItem)
})

// Eventos do Modal
function closeModal () {
  qs('.pizzaWindowArea').style.opacity = 0
  setTimeout(() => {
    qs('.pizzaWindowArea').style.display = 'none'
  }, 500)
}

function sizePrice (elem, num = 0) {
  if (elem.getAttribute('data-key') === '0') {
    if (elem === qs('.pizzaInfo--size.selected')) {
      modalQt = modalQt + num
    }

    modalPriceTotal = (modalPrice - 8) * modalQt

    qs('.pizzaInfo--qt').innerHTML = modalQt
    qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${modalPriceTotal.toFixed(2)}`
  } else if (elem.getAttribute('data-key') === '1') {
    if (elem === qs('.pizzaInfo--size.selected')) {
      modalQt = modalQt + num
    }

    modalPriceTotal = (modalPrice - 4) * modalQt

    qs('.pizzaInfo--qt').innerHTML = modalQt
    qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${modalPriceTotal.toFixed(2)}`
  } else {
    if (elem === qs('.pizzaInfo--size.selected')) {
      modalQt = modalQt + num
    }

    modalPriceTotal = modalPrice * modalQt

    qs('.pizzaInfo--qt').innerHTML = modalQt
    qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${modalPriceTotal.toFixed(2)}`
  }
}

qsa('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
  item.addEventListener('click', closeModal)
})

qs('.pizzaInfo--qtmenos').addEventListener('click', () => {
  if (modalQt > 1) {
    sizePrice(qs('.pizzaInfo--size.selected'), -1)
  }
})

qs('.pizzaInfo--qtmais').addEventListener('click', () => {
  sizePrice(qs('.pizzaInfo--size.selected'), 1)
})

qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
  size.addEventListener('click', (e) => {
    qs('.pizzaInfo--size.selected').classList.remove('selected')

    sizePrice(size)
    size.classList.add('selected')
  })
})

qs('.pizzaInfo--addButton').addEventListener('click', () => {
  const size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'))

  const identifier = pizzaJson[modalKey].id + '@' + size

  const key = cart.findIndex((item) => item.identifier === identifier)

  if (key > -1) {
    cart[key].qt += modalQt
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt
    })
  }

  updateCart()
  closeModal()
})

qs('.menu-openner span').addEventListener('click', () => {
  if (cart.length > 0) {
    qs('aside').style.left = '0'
  }
})

qs('.menu-closer').addEventListener('click', () => {
  qs('aside').style.left = '100vw'
})

function updateCart () {
  qs('.menu-openner span').innerHTML = cart.length

  if (cart.length > 0) {
    qs('aside').classList.add('show')
    qs('.cart').innerHTML = ''

    let subtotal = 0
    let desconto = 0
    let total = 0

    for (const i in cart) {
      const pizzaItem = pizzaJson.find((item) => item.id === cart[i].id)

      const cartItem = qs('.models .cart--item').cloneNode(true)
      let pizzaSizeName
      let pizzaSizePrice

      switch (cart[i].size) {
        case 0:
          pizzaSizeName = 'P'
          pizzaSizePrice = pizzaItem.price - 8
          break
        case 1:
          pizzaSizeName = 'M'
          pizzaSizePrice = pizzaItem.price - 4
          break
        default:
          pizzaSizeName = 'G'
          pizzaSizePrice = pizzaItem.price
          break
      }

      subtotal += pizzaSizePrice * cart[i].qt

      const pizza = `${pizzaItem.name} (${pizzaSizeName})`

      cartItem.querySelector('img').src = pizzaItem.img
      cartItem.querySelector('.cart--item-nome').innerHTML = pizza
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if (cart[i].qt > 1) {
          cart[i].qt--
        } else {
          cart.splice(i, 1)
        }

        updateCart()
      })

      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[i].qt++
        updateCart()
      })

      qs('.cart').append(cartItem)
    }

    desconto = subtotal * 0.1
    total = subtotal - desconto

    qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
    qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
    qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
  } else {
    qs('aside').classList.remove('show')
    qs('aside').style.left = '100vw'
  }
}
