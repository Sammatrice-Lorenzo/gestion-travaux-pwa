import { createClient } from '../../js/client/client.js'

export default async function initFormClientCreate({ $f7 } ) {
  const send = () => {
    const formData = $f7.form.convertToData('#form-client')
    createClient(formData, $f7)
  }

  return {
    send,
    titlePage: 'Nouveau client',
    blockTitle: 'Création d\'un client'
  }
}
