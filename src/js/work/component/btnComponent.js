/**
 * @param { string|null } valueInput
 * @return { void }
 */
export function addInputEquipement(valueInput = '') {
  const [equipement, equipements] = getInputsEquipements()

  const clone = equipement.cloneNode(true)
  const input = clone.querySelector('input[name="equipements"]')

  input.value = ''
  if (valueInput !== '') {
    input.value = valueInput
  }

  const deleteButton = document.createElement('a')
  deleteButton.href = '#'
  deleteButton.className = 'link icon-only color-red'

  deleteButton.innerHTML = '<i class="f7-icons">trash_circle</i>'
  deleteButton.addEventListener('click', deleteEquipement)
  clone.querySelector('.item-input-wrap').appendChild(deleteButton)

  equipements.appendChild(clone)

  const addButton = clone.querySelector('.add-equipement')
  addButton.addEventListener('click', () => addInputEquipement(''))
}

/**
 * Pour la première valeur du tableau on la set au premier input que on ne peut pas supprimer
 * @param {Array} valuesInputs
 * @return {void}
 */
export function getInputEquipementUpdateForm(valuesInputs) {
  const [equipement] = getInputsEquipements()

  equipement.querySelector('input[name="equipements"]').value = valuesInputs[0]
  valuesInputs.shift()

  for (const value of valuesInputs) {
    addInputEquipement(value)
  }
}

/**
 *
 * @returns {Array}
 */
function getInputsEquipements() {
  const equipements = document.getElementById('equipements-list')
  const equipement = document.querySelector('.equipement')

  return [equipement, equipements]
}

export function deleteEquipement(event) {
  const equipementItem = event.target.closest('.equipement')

  equipementItem.parentNode.removeChild(equipementItem)
}

/**
 * @return { string[] } equipements
 */
export function getEquipementsInForm() {
  const equipements = []
  const equipementsInputs = document.querySelectorAll(
    'input[name="equipements"]',
  )

  for (const equipement of equipementsInputs) {
    equipements.push(equipement.value)
  }

  return equipements
}
