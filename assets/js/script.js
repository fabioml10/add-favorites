let countriesDiv = null
let favoritesDiv = null

let manualCountries = [];
let manualFavorite = []

let countCountries = null
let countFavorites = null

let totalCountriesPop = null
let totalFavoritesPop = null

let numberFormat = null


window.addEventListener('load', () => {

  countriesDiv = document.querySelector('#tabCountries')
  favoritesDiv = document.querySelector('#tabFavorites')
  countCountries = document.querySelector('#total-countries')
  countFavorites = document.querySelector('#total-favorites')
  totalCountriesPop = document.querySelector('#total-countries-population')
  totalFavoritesPop = document.querySelector('#total-favorites-population')

  console.log(manualFavorite)

  numberFormat = Intl.NumberFormat('pt-BR')

  fecthCountries();

})

//requisição de maneira assincrona
async function fecthCountries() {
  const res = await fetch('https://restcountries.eu/rest/v2/all')
  const json = await res.json()

  manualCountries = json.map(country => {
    const { numericCode, translations, flag, population } = country
    return { id: numericCode, name: translations.pt, flag, population, formattedPopulation: formatNumber(population) }
  })

  manualCountries.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  render()
}

function render() {
  renderCountryList()
  renderFavoriteList()
  renderSummary()
  handleCountryButtons()
}

function renderCountryList() {

  let countriesHTML = `<div>`

  manualCountries.forEach(country => {
    const { id, name, flag, formattedPopulation } = country

    let countryHTML = `
      <div class="d-flex row">
        <div class="d-flex btn-container add-country">
          <a id="${id}" class="btn">+</a>
        </div>
        <div>
          <img src="${flag}" class="flag" alt="Bandeira do ${name}">
        </div>
        <div class="d-flex flex-column">
          <span class="country-name">${name}</span>
          <span class="country-population">${formattedPopulation}</span>
        </div>
      </div>
    `

    countriesHTML += `${countryHTML}`

  })

  countriesHTML += `</div>`
  countriesDiv.innerHTML = countriesHTML
}

function renderFavoriteList() {
  let favoritesHTML = `<div>`

  manualFavorite.forEach(country => {
    const { id, name, flag, formattedPopulation } = country

    let favoriteHTML = `
      <div class="d-flex row">
      <div class="d-flex btn-container remove-country">
          <a id="${id}" class="btn">-</a>
        </div>
        <div>
          <img src="${flag}" class="flag" alt="Bandeira do ${name}">
        </div>
        <div class="d-flex flex-column">
          <span class="country-name">${name}</span>
          <span class="country-population">${formattedPopulation}</span>
        </div>
      </div>
    `

    favoritesHTML += `${favoriteHTML}`
  })

  favoritesHTML += `</div>`
  favoritesDiv.innerHTML = favoritesHTML
}

function renderSummary() {

  countCountries = manualCountries.length
  countFavorites = manualFavorite.length

  const totalCountriesPopulation = manualCountries.reduce((acc, cur) => {
    return acc + cur.population
  }, 0)

  const totalFavoritesPopulation = manualFavorite.reduce((acc, cur) => {
    return acc + cur.population
  }, 0)

  totalCountriesPop.textContent = formatNumber(totalCountriesPopulation)
  totalFavoritesPop.textContent = formatNumber(totalFavoritesPopulation)

}


function handleCountryButtons() {
  const countryButtons = Array.from(countriesDiv.querySelectorAll("a"))
  const favortiteButtons = Array.from(favoritesDiv.querySelectorAll("a"))

  countryButtons.forEach(button => {
    button.addEventListener('click', () => addToFavorites(button.id))
  })

  favortiteButtons.forEach(button => {
    button.addEventListener('click', () => removeFromFavorites(button.id))
  })
}

function addToFavorites(id) {
  const toAdd = manualCountries.find(country => country.id === id)

  manualFavorite = [...manualFavorite, toAdd]

  //mutável
  manualFavorite.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
  //imutavel
  manualCountries = manualCountries.filter(country => country.id !== id)

  render()

}

function removeFromFavorites(id) {
  const toRemove = manualFavorite.find(country => country.id === id)

  manualCountries = [...manualCountries, toRemove]

  //mutável
  manualCountries.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
  //imutavel
  manualFavorite = manualFavorite.filter(country => country.id !== id)

  render()
}

function formatNumber(number) {
  return numberFormat.format(number)
}