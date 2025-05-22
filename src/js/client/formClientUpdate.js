import { findClientById, updateClient } from './client'

export default async function initFormClientUpdate ({ $on, $f7, clientId } )  {
  const client = await findClientById(clientId, $f7)

  const formClient = {
    firstname: client.firstname,
    lastname: client.lastname,
    city: client.city,
    phoneNumber: client.phoneNumber.replace(/\./g, ''),
    postalCode: client.postalCode,
    streetAddress: client.streetAddress,
    email: client.email
  }

  const send = () => {
    const formData = $f7.form.convertToData('#form-client')
    updateClient(formData, clientId, $f7)
  }

  $on('pageBeforeIn', () => {
    $f7.form.fillFromData('#form-client', formClient)
  })

  return {
    send,
    titlePage: 'Modification client',
    blockTitle: 'Modification informations'
  }
}